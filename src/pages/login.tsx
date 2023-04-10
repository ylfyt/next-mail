import { IonContent, IonPage } from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FC, useState } from 'react';
import { auth } from '../utils/firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();

	const login = async () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((cred) => {
				history.replace('home');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<IonPage>
			<IonContent fullscreen>
				<div>Login</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						login();
					}}
				>
					<input type="email" onChange={(e) => setEmail(e.target.value)} />
					<input type="password" onChange={(e) => setPassword(e.target.value)} />
					<button type="submit" disabled={!email || !password}>
						Submit
					</button>
				</form>
				<div>
					<Link to="/register" replace>
						Register
					</Link>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Login;
