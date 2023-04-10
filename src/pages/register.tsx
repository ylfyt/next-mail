import { IonContent, IonPage } from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FC, useState } from 'react';
import { auth } from '../utils/firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

interface RegisterProps {}

const Register: FC<RegisterProps> = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();

	const register = async () => {
		console.log(email, password);

		createUserWithEmailAndPassword(auth, email, password)
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
				<div>Register</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						register();
					}}
				>
					<input type="email" onChange={(e) => setEmail(e.target.value)} />
					<input type="password" onChange={(e) => setPassword(e.target.value)} />
					<button type="submit" disabled={!email || !password}>
						Submit
					</button>
				</form>
				<div>
					<Link to="/login" replace>
						Login
					</Link>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Register;
