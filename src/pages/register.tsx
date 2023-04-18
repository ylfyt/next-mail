import { IonContent, IonPage } from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FC, useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import LoadingButton from '../components/loading-button';
import { useHelperContext } from '../contexts/helper';
import { IUserInfo } from '../interfaces/user-info';
import { doc, setDoc } from 'firebase/firestore';
import { useRootContext } from '../contexts/root';

interface RegisterProps {}

const Register: FC<RegisterProps> = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { user, loadingUser } = useRootContext();
	const { showToast } = useHelperContext();

	const history = useHistory();

	useEffect(() => {
		if (!loadingUser && user) {
			history.replace('inbox');
		}
	}, [loadingUser, user]);

	const register = async () => {
		try {
			setLoading(true);
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			const info: IUserInfo = {
				id: cred.user.uid,
				email: email,
				publicKey: '',
			};
			await setDoc(doc(db, 'userInfo', info.email), info);

			setLoading(false);
			history.replace('/');
		} catch (err) {
			setLoading(false);
			console.log(err);
			if (err instanceof Error) {
				if (err?.message?.includes('email-already-in-use')) {
					showToast('Email already in use');
				}
			}
		}
	};

	return (
		<IonPage>
			<IonContent fullscreen>
				<div className="h-full flex flex-col items-center text-black md:justify-center md:w-1/2 md:mx-auto">
					<div className="font-bold text-2xl mt-[50%] md:mt-0 mb-2">Register</div>
					<div className="flex flex-col w-full px-4 items-center mb-10">
						<input type="email" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-[#eeeeee]" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
						<input type="password" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-[#eeeeee]" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
						<LoadingButton loading={loading} disabled={!email || !password} onClick={register} className="bg-blue-500 w-[100px] min-h-[35px] rounded-lg">
							Submit
						</LoadingButton>
					</div>
					<div className="flex">
						Already have an account?
						<Link to="/login" className="ml-1 text-blue-500 underline" replace>
							Login
						</Link>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Register;
