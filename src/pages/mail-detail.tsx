import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IMail } from '../interfaces/mail';
import { DocumentReference, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../utils/firebase';
import { ISignedMessage } from '../interfaces/message';
import InputTextWithFile from '../components/input-text-with-file';
import LoadingButton from '../components/loading-button';
import { suffleDecrypt } from '../algorithms/shuffle-aes';
import { parseMessage } from '../utils/parse-message';
import { documentAttachSharp, keySharp } from 'ionicons/icons';
import { useRootContext } from '../contexts/root';
import { decodePublicKey, decodeSignature } from '../algorithms/encoderDecoder';
import { verify } from '../algorithms/ecdsa';
import { getDownloadURL, ref } from '@firebase/storage';

interface MailDetailProps {}

const MailDetail: FC<MailDetailProps> = () => {
	const { user } = useRootContext();
	const { id } = useParams<{ id: string }>();
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [mail, setMail] = useState<IMail>();
	const [signed, setSigned] = useState<ISignedMessage>();
	const [isValidSignature, setIsValidSignature] = useState(true);
	const [encryptionKey, setEncryptionKey] = useState('');

	const [errorMessage, setErrorMessage] = useState('');
	const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			const docRef = doc(db, 'mail', id) as DocumentReference<IMail>;
			setLoading(true);
			const snap = await getDoc(docRef);
			setLoading(false);

			if (!snap.exists()) {
				history.replace('inbox');
				return;
			}

			const data = snap.data();

			setMail({
				id: snap.id,
				...data,
			});

			if (data.isEncrypted) return;

			if (!data.readAt && data.receiverInfo.id === user?.uid) {
				setDoc(docRef, {
					...data,
					readAt: new Date().getTime(),
				}).catch((err) => {
					console.log(err);
				});
			}

			const msg = parseMessage(data.message);
			if (!msg) {
				setErrorMessage('Message Data is Not Valid');
				return;
			}

			setSigned(msg);
			if (msg.signature !== '') {
				// get public key
				const publicKeyEncoded: string = data.senderInfo.publicKey;
				// decode public key
				const publicKey = decodePublicKey(publicKeyEncoded);

				if (publicKey[0] === 0n || publicKey[1] === 0n) {
					setIsValidSignature(false);
					// setErrorMessage('Signature Violation');
					return;
				}

				// get message
				const messageSanitize = data.message.split('<******>');
				messageSanitize.pop();
				const rawMessage = messageSanitize.join('<******>');
				// get signature
				const signature = msg.signature;
				// decode signature
				const [r, s] = decodeSignature(signature);
				// verify
				const valid = verify(rawMessage, r, s, publicKey);
				if (!valid) {
					setIsValidSignature(false);
					// setErrorMessage('Signature Violation');
					return;
				}
			}
		})();
	}, []);

	useEffect(() => {
		if (!mail || !signed || signed.message.attachments.length === 0) return;

		(async () => {
			try {
				const temp: string[] = [];
				for (const attach of signed.message.attachments) {
					const path = `attachments/${mail.senderInfo.id}:${mail.receiverInfo.id}/${attach.fileName}.${attach.ext}`;
					const url = await getDownloadURL(ref(storage, path));
					temp.push(url);
				}
				setAttachmentUrls(temp);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [signed]);

	const decrypt = () => {
		if (!mail) return;

		const decrypted = suffleDecrypt(mail.message, encryptionKey);

		const msg = parseMessage(decrypted);
		if (!msg) {
			setErrorMessage('Decryption Key is Not Valid');
			return;
		}

		if (!mail.readAt && mail.receiverInfo.id === user?.uid) {
			setDoc(doc(db, 'mail', id), {
				...mail,
				readAt: new Date().getTime(),
			}).catch((err) => {
				console.log(err);
			});
		}

		setSigned(msg);
		if (msg.signature !== '') {
			// get public key
			const publicKeyEncoded = mail.senderInfo.publicKey;
			// decode public key
			const publicKey = decodePublicKey(publicKeyEncoded);

			if (publicKey[0] === 0n || publicKey[1] === 0n) {
				setIsValidSignature(false);
				// setErrorMessage('Signature Violation');
				return;
			}

			// get message
			const messageSanitize = decrypted.split('<******>');
			messageSanitize.pop();
			const rawMessage = messageSanitize.join('<******>');
			// get signature
			const signature = msg.signature;
			// decode signature
			const [r, s] = decodeSignature(signature);
			// verify
			const valid = verify(rawMessage, r, s, publicKey);
			if (!valid) {
				setIsValidSignature(false);
				// setErrorMessage('Signature Violation');
				return;
			}
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/inbox"></IonBackButton>
					</IonButtons>
					<IonTitle>{signed?.message.subject}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div className="flex justify-center min-h-[80vh] md:w-1/2 md:mx-auto pb-10">
					{loading || !mail ? (
						<div
							className="w-12 h-12 rounded-full animate-spin
                    border-2 border-solid border-blue-500 border-t-transparent mt-auto mb-auto"
						></div>
					) : errorMessage ? (
						<div className="flex justify-center items-center text-3xl font-semibold text-red-500">{errorMessage}</div>
					) : mail.isEncrypted && !signed ? (
						<div className="flex w-full flex-col items-center justify-center">
							<span className="text-3xl font-semibold mb-6">This mail is Encrypted</span>
							<InputTextWithFile charLimit={16} placeholder="16 Digit Encryption Key" className="w-full px-6" value={encryptionKey} setValue={setEncryptionKey} />
							<LoadingButton disabled={encryptionKey.length !== 16 || !mail} onClick={decrypt} className="w-[100px] bg-blue-500 h-[40px] rounded-lg text-white shadow mt-2">
								Open
							</LoadingButton>
						</div>
					) : (
						<div className="w-full px-2 flex flex-col">
							<div className="text-lg font-medium mt-2 flex items-center">
								{signed?.signature !== '' && (
									<IonIcon
										title={isValidSignature ? 'Signature is valid' : 'Signature is not valid'}
										icon={keySharp}
										className={`${isValidSignature ? 'text-green-500' : 'text-red-500'} mr-2 text-base`}
									/>
								)}
								<span className="">{signed?.message.subject}</span>
							</div>
							<div className="text-xs mb-2">
								<div>{mail.senderInfo.email}</div>
								<div className="text-gray-600">{new Date(mail.createdAt).toLocaleString()}</div>
							</div>
							<div className="text-xs flex flex-col mb-4">
								{attachmentUrls.map((url, idx) => {
									const attach = signed?.message.attachments[idx];
									return (
										<a target="_blank" href={url} key={idx} className="flex items-center mb-2 bg-gray-200 p-2 rounded-md">
											<IonIcon icon={documentAttachSharp} className="text-gray-600 mr-1" />
											<span>
												{attach?.originalFileName}.{attach?.ext}
											</span>
										</a>
									);
								})}
							</div>
							<div className="text-sm mb-4 p-1 border-gray-200 border rounded min-h-[100px] relative">
								{!isValidSignature && <div className="absolute -top-5 right-1 text-red-500 font-semibold">WARNING: Signature is not valid</div>}
								<span>{signed?.message.body}</span>
								{signed?.signature !== '' && (
									<>
										<br />
										<br />
										<br />
										<div className="text-center">---- Begin of digital signature ----</div>
										<div className="uppercase text-center">{signed?.signature}</div>
										<div className="text-center">---- End of digital signature ----</div>
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</IonContent>
		</IonPage>
	);
};

export default MailDetail;
