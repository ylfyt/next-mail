import { IonContent, IonPage } from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FC, useState } from 'react';
import { auth } from '../utils/firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Spinner from '../components/spinner';

interface RegisterProps {}

const Register: FC<RegisterProps> = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();

	const register = async () => {
		setLoading(true);
		createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
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
					<div className="font-bold text-2xl mt-[50%] md:mt-0 mb-2">Register</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							register();
						}}
						className="flex flex-col w-full px-4 items-center mb-10"
					>
						<input type="email" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-white" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
						<input type="password" className="mb-2 min-h-[35px] rounded-lg py-2 px-3 w-full bg-white" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
						<button type="submit" disabled={!email || !password} className="bg-blue-500 w-[100px] min-h-[35px] flex justify-center items-center rounded-lg shadow-md disabled:opacity-75 text-white">
							{loading ? <Spinner className="w-4 h-4" /> : <span>Submit</span>}
						</button>
					</form>
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
