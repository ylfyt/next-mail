import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { exitOutline, manOutline } from 'ionicons/icons';
import './Home.css';
import Hello from '../components/Hello';
import { useEffect, useState } from 'react';
import { useRootContext } from '../contexts/root';
import { useHistory } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { useCryptoWorkerContext } from '../contexts/crypto-worker';
import { useHelperContext } from '../contexts/helper';
import { IMail } from '../interfaces/mail';
import { CollectionReference, collection, getDocs, query, where } from 'firebase/firestore';

const Home: React.FC = () => {
	const [mails, setMails] = useState<IMail[]>([]);
	const { user, loadingUser } = useRootContext();
	const { runCrypto } = useCryptoWorkerContext();
	const { showToast } = useHelperContext();
	const history = useHistory();

	useEffect(() => {
		if (loadingUser || user) return;

		history.replace('login');
	}, [user, loadingUser]);

	const logout = () => {
		signOut(auth)
			.then(() => {
				history.replace('login');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		if (!user) return;
		let mounted = true;

		(async () => {
			const mailCollection = collection(db, 'mail') as CollectionReference<IMail>;
			const snap = await getDocs(query(mailCollection, where('receiverId', '==', user.uid)));
			if (!mounted) return;
      
			const temp: IMail[] = [];
			snap.forEach((doc) => {
				temp.push(doc.data());
			});
			setMails(temp);
		})();

		return () => {
			mounted = false;
		};
	}, [user]);

	if (loadingUser || !user) return <div>Loading...</div>;

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="primary">
						<IonButton
							onClick={() => {
								logout();
							}}
							color="danger"
						>
							<IonIcon icon={exitOutline}></IonIcon>
						</IonButton>
					</IonButtons>
					<IonTitle>Next Email</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">The Next Gen Email</IonTitle>
					</IonToolbar>
				</IonHeader>
				<div className="h-full flex flex-col items-center text-black mt-4 md:w-1/2 md:mx-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3">
									Sender
								</th>
								<th scope="col" className="px-6 py-3">
									Subject
								</th>
								<th scope="col" className="px-6 py-3">
									Body
								</th>
								<th scope="col" className="px-6 py-3">
									Sent date
								</th>
							</tr>
						</thead>
						<tbody>
							{mails.map((mail, idx) => {
								return (
									<tr key={idx} className={`bg-white border-b ${mail.readAt ? '' : 'text-gray-900 font-bold'}`}>
										<td className="px-1 py-2">{mail.senderInfo?.email}</td>
										<td className="px-1 py-4">{mail.subject}</td>
										<td className="px-1 py-4">{mail.body}</td>
										<td className="px-1 py-4">{new Date(mail.createdAt).toLocaleString()}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Home;
