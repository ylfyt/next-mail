import { IonPage, IonButtons, IonHeader, IonContent, IonToolbar, IonTitle, IonIcon, IonButton, IonMenuButton } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import { exitOutline } from 'ionicons/icons';
import "./compose.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import Menu from "../components/menu";
import { collection, CollectionReference, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useHelperContext } from "../contexts/helper";
import { useRootContext } from "../contexts/root";
import { IMail } from "../interfaces/mail";
import ComposeFab from "../components/Compose-fab";
import { IMessage, ISignedMessage } from "../interfaces/message";

const Sent: React.FC = () => {
	const { state } = useLocation();

	const [mails, setMails] = useState<IMail[]>([]);
	const { user, loadingUser } = useRootContext();
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
			const snap = await getDocs(query(mailCollection, where('senderInfo.id', '==', user.uid)));
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
				<IonContent className="ion-padding">
					<div className="h-full flex flex-col items-center text-black mt-4 md:w-1/2 md:mx-auto">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th scope="col" className="px-6 py-3">
										Receiver
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
                  let subject = 'Encrypted';
									let body = 'Encrypted';

									if (!mail.isEncrypted) {
										const signed = JSON.parse(mail.message) as ISignedMessage;
										if (signed.signature !== '') {
											// Checking signature
										} else {
											const message = JSON.parse(signed.message) as IMessage;
											subject = message.subject;
											body = message.body;
										}
									}

									return (
										<tr key={idx} className={`bg-white border-b ${mail.readAt ? '' : 'text-gray-900 font-bold'}`}>
											<td className="px-1 py-2">{mail.senderInfo?.email}</td>
											<td className="px-1 py-4">{subject}</td>
											<td className="px-1 py-4">{body}</td>
											<td className="px-1 py-4">{new Date(mail.createdAt).toLocaleString()}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<ComposeFab />
				</IonContent>
			</IonPage>
		</>
	);
}

export default Sent;