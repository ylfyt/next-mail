import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { exitOutline } from 'ionicons/icons';
import './Home.css';
import Hello from '../components/Hello';
import { useEffect } from 'react';
import { useRootContext } from '../contexts/root';
import { useHistory } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useCryptoWorkerContext } from '../contexts/crypto-worker';

const Home: React.FC = () => {
	const { user, loadingUser } = useRootContext();
	const { runCrypto } = useCryptoWorkerContext();
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
		(async () => {
			const res = await runCrypto('encrypt', '1234567890abf', '1234567890abcdef');
			console.log('ec', res);

			const dec = await runCrypto('decrypt', res.data!, '1234567890abcdef');
			console.log('dc', dec);
		})();
	}, []);

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
