import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { banSharp, exitOutline, keySharp, lockClosed } from 'ionicons/icons';
import './Home.css';
import { useEffect, useState } from 'react';
import { useRootContext } from '../contexts/root';
import { useHistory } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { IMail } from '../interfaces/mail';
import { CollectionReference, Unsubscribe, collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Menu from '../components/menu';
import ComposeFab from '../components/Compose-fab';
import { ISignedMessage } from '../interfaces/message';
import { Link } from 'react-router-dom';
import { parseMessage } from '../utils/parse-message';

const Home: React.FC = () => {
	const [mails, setMails] = useState<IMail[]>([]);
	const { user, loadingUser } = useRootContext();
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
		let unsub: Unsubscribe | null;

		(async () => {
			const mailCollection = collection(db, 'mail') as CollectionReference<IMail>;
			const mailQuery = query(mailCollection, where('receiverId', '==', user.uid), orderBy('createdAt', 'desc'));
			unsub = onSnapshot(mailQuery, (snap) => {
				if (!mounted) return;

				const temp: IMail[] = [];
				snap.forEach((doc) => {
					temp.push({
						id: doc.id,
						...doc.data(),
					});
				});
				setMails(temp);
			});
		})();

		return () => {
			unsub && unsub();
			mounted = false;
		};
	}, [user]);

	if (loadingUser || !user) return <div>Loading...</div>;

	return (
		<>
			<Menu />
			<IonPage id="menu">
				<IonHeader>
					<IonToolbar>
						<IonButtons slot="start">
							<IonMenuButton></IonMenuButton>
						</IonButtons>
						<IonButtons slot="primary">
							<IonButton onClick={logout} color="danger">
								<IonIcon icon={exitOutline}></IonIcon>
							</IonButton>
						</IonButtons>
						<IonTitle>Next Email</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent fullscreen>
					<div className="flex flex-col items-center text-black mt-4 md:w-1/2 md:mx-auto">
						<div className="w-full text-sm text-left text-gray-500 px-2">
							{mails.map((mail, idx) => {
								let subject = 'Encrypted';
								let body = 'Encrypted';
								let signed: ISignedMessage | null = null;

								if (!mail.isEncrypted) {
									signed = parseMessage(mail.message);

									if (signed) {
										subject = signed.message.subject;
										body = signed.message.body;
									}
								}

								return (
									<Link key={idx} to={`/inbox/${mail.id}`} className="flex flex-col border-2 border-gray-500 p-1 rounded mb-2 hover:border-blue-500 relative">
										<div className="flex justify-between mb-2 text-xs">
											<div>{mail.senderInfo.email}</div>
											<div>{new Date(mail.createdAt).toLocaleString()}</div>
										</div>

										{mail.isEncrypted || signed?.signature !== '' ? (
											<div className="flex">
												{mail.isEncrypted && (
													<div className="flex text-orange-600 md:items-center mr-2">
														<IonIcon className="mr-1" icon={lockClosed} />
														<span className="text-xs">Encrypted</span>
													</div>
												)}
												{signed?.signature !== '' && (
													<div className="flex text-green-600 items-center">
														<IonIcon className="mr-1" icon={keySharp} />
														<span className="text-xs">Signed</span>
													</div>
												)}
											</div>
										) : !signed ? (
											<div className="flex items-center text-red-600 font-medium">
												<IonIcon icon={banSharp} className="mr-1" />
												<span>Mail is broken</span>
											</div>
										) : (
											<div>
												<div className="font-bold md:font-semibold line-clamp-1 text-sm">{subject}</div>
												<div className="text-xs line-clamp-2">{body}</div>
											</div>
										)}
										{!mail.readAt && <div className="w-[10px] h-[10px] translate-x-1/2 -translate-y-1/2 bg-red-500 absolute top-0 right-0 rounded-full"></div>}
									</Link>
								);
							})}
						</div>
					</div>
					<ComposeFab />
				</IonContent>
			</IonPage>
		</>
	);
};

export default Home;
