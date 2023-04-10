import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import Hello from '../components/Hello';
import { useEffect } from 'react';
import { db } from '../utils/firebase';
import { CollectionReference, collection, getDocs, query } from 'firebase/firestore';
import { IMail } from '../interfaces/mail';

const Home: React.FC = () => {
	useEffect(() => {
		(async () => {
			const projectCollection = collection(db, 'mails') as CollectionReference<IMail>;
			const snap = await getDocs(query(projectCollection));
			const temp: IMail[] = [];
			snap.forEach((mail) => {
				temp.push({
					id: mail.id,
					...mail.data(),
				});
			});

			console.log(temp);
		})();
	}, []);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>The Next Gen Email</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">The Next Gen Email</IonTitle>
					</IonToolbar>
				</IonHeader>
				<Hello />
			</IonContent>
		</IonPage>
	);
};

export default Home;
