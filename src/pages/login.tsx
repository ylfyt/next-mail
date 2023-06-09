import { IonContent, IonPage } from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FC, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import LoadingButton from '../components/loading-button';
import { useHelperContext } from '../contexts/helper';
import { useRootContext } from '../contexts/root';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
	const { loadingUser, user } = useRootContext();

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();

	const { showToast } = useHelperContext();

	useEffect(() => {
		if (!loadingUser && user) {
			history.replace('inbox');
		}
	}, [loadingUser, user]);

	const login = async () => {
		try {
			setLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
			setLoading(false);
			history.replace('/', { state: { email: email } });
		} catch (err) {
			setLoading(false);
			showToast('Email or password is incorrect');
		}
	};

	if (loadingUser && !user) return <div>Loading...</div>;

	return (
		<IonPage>
			<IonContent fullscreen>
				<div className="h-full flex flex-col items-center text-black md:justify-center md:w-1/2 md:mx-auto">
					<div className="text-blue-500 italic font-semibold text-4xl mt-[30%] md:mt-0 mb-10">Next Mail</div>
					<div className="font-bold text-2xl mb-2 mt-10 md:mt-4">Login</div>
					<div className="flex flex-col w-full px-4 items-center mb-10">
						<input type="email" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-[#eeeeee]" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
						<input type="password" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-[#eeeeee]" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
						<LoadingButton loading={loading} disabled={!email || !password} onClick={login} className="bg-blue-500 w-[100px] min-h-[35px] rounded-lg text-white">
							Submit
						</LoadingButton>
					</div>
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
