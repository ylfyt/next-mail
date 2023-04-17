import { DocumentReference, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { IUserInfo } from '../interfaces/user-info';
import { db } from './firebase';
import { IAttachment } from '../interfaces/attachment';
import { IMail } from '../interfaces/mail';
import { uploadFiles } from './upload-file';
import { User } from 'firebase/auth';

const saveMail = async (attachments: IAttachment[], senderInfo: IUserInfo, receiverId: string, subject: string, body: string): Promise<IMail | null> => {
	const mail: IMail = {
		attachments,
		body: body,
		receiverId,
		senderInfo,
		subject: subject,
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

export const sendMail = async (user: User, receiverEmail: string, files: File[], subject: string, body: string): Promise<string | IMail> => {
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

		const mail = await saveMail(
			attch,
			{
				email: user!.email!,
				id: user!.uid,
				publicKey: '',
			},
			receiver.data().id,
			subject,
			body
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
