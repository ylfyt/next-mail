import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
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

	if (loadingUser || !user) return <div>Loading...</div>;

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle color="dark">The Next Gen Email</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">The Next Gen Email</IonTitle>
					</IonToolbar>
				</IonHeader>
				<Hello />
				<div>
					<button
						onClick={() => {
							signOut(auth)
								.then(() => {
									// Sign-out successful.
									history.replace('login');
								})
								.catch((error) => {
									// An error happened.
									console.log(error);
								});
						}}
					>
						Logout
					</button>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Home;
