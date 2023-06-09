import { DocumentReference, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { IUserInfo } from '../interfaces/user-info';
import { db } from './firebase';
import { IMail } from '../interfaces/mail';
import { uploadFiles } from './upload-file';
import { User } from 'firebase/auth';
import { suffleEncrypt } from '../algorithms/shuffle-aes';
import { generatePublicKey, signing } from '../algorithms/ecdsa';
import { encodeSignature, decodePrivateKey, encodePublicKey } from '../algorithms/encoderDecoder';

const saveMail = async (senderInfo: IUserInfo, receiverInfo: IUserInfo, message: string, isEncrypted: boolean): Promise<IMail | null> => {
	const mail: IMail = {
		receiverInfo,
		senderInfo,
		message,
		isEncrypted,
		createdAt: new Date().getTime(),
	};
	try {
		const docRef = await addDoc(collection(db, 'mail'), mail);

		mail.id = docRef.id;
		return mail;
	} catch (error) {
		console.log(error);
		return null;
	}
};

interface IMailInfo {
	files: File[];
	subject: string;
	body: string;
	encryptionKey?: string;
	signatureKey?: string;
}

export const sendMail = async (user: User, receiverEmail: string, { files, subject, body, encryptionKey, signatureKey }: IMailInfo): Promise<string | IMail> => {
	try {
		if (signatureKey) {
			const privateKey = decodePrivateKey(signatureKey);

			if (privateKey === 0n) {
				return 'Signature Key is not valid';
			}
		}

		const receiverRef = doc(db, 'userInfo', receiverEmail) as DocumentReference<IUserInfo>;
		const receiver = await getDoc(receiverRef);

		if (!receiver.exists() || !receiver.data()) {
			return 'Receiver not found';
		}

		let message = `${subject}<******>${body}`;

		if (files.length != 0) {
			const attch = await uploadFiles(files, user!.uid, receiver.data().id);

			if (typeof attch === 'string') {
				return attch;
			}

			let attachments = ``;
			for (let i = 0; i < attch.length; i++) {
				const e = attch[i];
				attachments += `${e.fileName}<>${e.originalFileName}<>${e.ext}`;
				if (i !== attch.length - 1) {
					attachments += '<***>';
				}
			}
			message += `<******>${attachments}`;
		}
		let publicKeyEncoded = '';
		if (signatureKey) {
			// decode private key to bigint
			// console.log("privatekey:",signatureKey);
			const privateKey = decodePrivateKey(signatureKey);
			// generate public key (bigint) from private key
			const publicKey = generatePublicKey(privateKey);
			// encode public key (string)
			publicKeyEncoded = encodePublicKey(publicKey);
			// generate signature
			const signature = signing(message, publicKey, privateKey);
			// encode signature
			const signatureEncoded = encodeSignature(signature);
			// console.log('signatures', signatureEncoded);
			// attach
			// signed.signature = signatureEncoded; // Sign

			if (files.length !== 0) {
				message += `<******>${signatureEncoded}`;
			} else {
				message += `<******><#ds>${signatureEncoded}`;
			}
		}

		let isEncrypted = false;
		if (encryptionKey) {
			isEncrypted = true;
			message = await suffleEncrypt(message, encryptionKey);
		}

		const mail = await saveMail(
			{
				email: user!.email!,
				id: user!.uid,
				publicKey: publicKeyEncoded,
			},
			{
				email: receiver.data().email,
				id: receiver.data().id,
				publicKey: '',
			},
			message,
			isEncrypted
		);

		if (!mail) {
			return 'Something wrong!';
		}

		return mail;
	} catch (error) {
		console.log(error);
		return (error as Error).message;
	}
};
