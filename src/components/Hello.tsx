import { useState } from 'react';
import './Hello.css';
import { uploadFiles } from '../utils/upload-file';
import { useRootContext } from '../contexts/root';
import { useHelperContext } from '../contexts/helper';
import { DocumentReference, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { IUserInfo } from '../interfaces/user-info';
import { IAttachment } from '../interfaces/attachment';
import { IMail } from '../interfaces/mail';
import LoadingButton from './loading-button';

interface HelloProps {}

const Hello: React.FC<HelloProps> = () => {
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState<FileList | null>(null);

	const { user } = useRootContext();
	const { showToast } = useHelperContext();

	const sendMail = async (attachments: IAttachment[], senderInfo: IUserInfo, receiverId: string): Promise<IMail | null> => {
		const mail: IMail = {
			attachments,
			body: 'Hello, World',
			receiverId,
			senderInfo,
			subject: 'HELLO',
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

	const send = async () => {
		try {
			setLoading(true);
			const receiverRef = doc(db, 'userInfo', 'yalfayat@gmail.com') as DocumentReference<IUserInfo>;
			const receiver = await getDoc(receiverRef);

			if (!receiver.exists() || !receiver.data()) {
				setLoading(false);
				showToast('Receiver not found');
				return;
			}

			const attch = await uploadFiles(files!, user!.uid, receiver.data().id);

			if (typeof attch === 'string') {
				setLoading(false);
				showToast(attch);
				return;
			}

			const mail = await sendMail(
				attch,
				{
					email: user!.email!,
					id: user!.uid,
					publicKey: '',
				},
				receiver.data().id
			);

			setLoading(false);
			console.log(mail);
			showToast(`Email sent to ${receiver.data().email}`);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	return (
		<div className="container flex flex-col justify-center items-center">
			<strong className="mb-10">Hello {user?.email} 👋</strong>
			<div>
				<input
					type="file"
					multiple
					onChange={(e) => {
						setFiles(e.target.files);
					}}
				/>
				<LoadingButton disabled={files == null || files.length === 0} loading={loading} onClick={send} className="bg-blue-500 w-[100px] min-h-[35px] rounded-lg">
					Send
				</LoadingButton>
			</div>
		</div>
	);
};

export default Hello;
