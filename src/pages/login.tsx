import { IonButton, IonContent, IonLoading, IonPage } from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FC, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Spinner from '../components/spinner';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();

	useEffect(() => {
		setLoading(false);
	}, []);

	const login = async () => {
		setLoading(true);
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				setLoading(false);
				history.replace('home');
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<IonPage>
			<IonContent fullscreen>
				<div className="h-full bg-[#eeeeee] flex flex-col items-center text-black md:justify-center md:w-1/2 md:mx-auto">
					<div className="font-bold text-2xl mt-[50%] md:mt-0 mb-2">Login</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							login();
						}}
						className="flex flex-col w-full px-4 items-center mb-10"
					>
						<input type="email" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-white" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
						<input type="password" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-white" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
						<button
							type="submit"
							disabled={!email || !password}
							className="bg-blue-500 w-[100px] min-h-[35px] flex justify-center items-center rounded-lg shadow-md disabled:opacity-75 text-white outline-none"
						>
							{loading ? <Spinner className="w-3 h-3" /> : <span>Submit</span>}
						</button>
					</form>
					<div className="flex">
						Don't have an account?
						<Link to="/register" className="ml-1 text-blue-500 underline" replace>
							Register
						</Link>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Login;
