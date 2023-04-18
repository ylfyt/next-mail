import { DocumentReference, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { IUserInfo } from '../interfaces/user-info';
import { db } from './firebase';
import { IMail } from '../interfaces/mail';
import { uploadFiles } from './upload-file';
import { User } from 'firebase/auth';
import { IMessage, ISignedMessage } from '../interfaces/message';
import { suffleEncrypt } from '../algorithms/shuffle-aes';

const saveMail = async (senderInfo: IUserInfo, receiverId: string, message: string, isEncrypted: boolean): Promise<IMail | null> => {
	const mail: IMail = {
		receiverId,
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

		if (signatureKey) {
			const signature = 'dasbdklasmdlsam,ds'; // Sign
			message += `<******>${signature}`;
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
				publicKey: '',
			},
			receiver.data().id,
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
