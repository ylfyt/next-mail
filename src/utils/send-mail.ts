import { DocumentReference, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { IUserInfo } from '../interfaces/user-info';
import { db } from './firebase';
import { IAttachment } from '../interfaces/attachment';
import { IMail } from '../interfaces/mail';
import { uploadFiles } from './upload-file';
import { User } from 'firebase/auth';
import { IMessage, ISignedMessage } from '../interfaces/message';

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

		const attch = await uploadFiles(files, user!.uid, receiver.data().id);

		if (typeof attch === 'string') {
			return attch;
		}

		const message = JSON.stringify({
			subject,
			body,
			attachments: attch,
		} as IMessage);

		const signed: ISignedMessage = {
			message: message,
			signature: '',
		};

		if (signatureKey) {
			signed.signature = 'dasbdklasmdlsam,ds'; // Sign
		}

		let encrypted = JSON.stringify(signed);
		let isEncrypted = false;
		if (encryptionKey) {
			isEncrypted = true;
			encrypted = encrypted;
		}

		const mail = await saveMail(
			{
				email: user!.email!,
				id: user!.uid,
				publicKey: '',
			},
			receiver.data().id,
			encrypted,
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
