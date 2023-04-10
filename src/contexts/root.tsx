import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';

interface IRootContext {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	loadingUser: boolean;
}

const RootContext = createContext<IRootContext>({
	user: null,
	setUser: () => {},
	loadingUser: true,
});

export const useRootContext = () => {
	return useContext(RootContext);
};

interface Props {
	children: ReactNode;
}
const RootProvider: FC<Props> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setLoadingUser(false);
			setUser(user);
		});
	}, []);

	return <RootContext.Provider value={{ loadingUser, user, setUser }}>{children}</RootContext.Provider>;
};

export default RootProvider;
