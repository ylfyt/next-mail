import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { exitOutline } from 'ionicons/icons';
import './Home.css';
import Hello from '../components/Hello';
import { useEffect } from 'react';
import { useRootContext } from '../contexts/root';
import { useHistory } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const Home: React.FC = () => {
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
				<Hello />
			</IonContent>
		</IonPage>
	);
};

export default Home;
