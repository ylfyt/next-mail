import { createContext, FC, ReactNode, useContext, useState } from 'react';

interface IHelperContext {
	showToast: (message: string, durationMs?: number) => void;
	toastMessage: string;
	toastDuration: number;
	isToastOpen: boolean;
	setIsToastOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HelperContext = createContext<IHelperContext>({
	showToast() {
		throw new Error('not implemented yet');
	},
	toastMessage: '',
	toastDuration: 3000,
	isToastOpen: false,
	setIsToastOpen: () => {},
});

interface Props {
	children: ReactNode;
}
const HelperProvider: FC<Props> = ({ children }) => {
	const [isToastOpen, setIsToastOpen] = useState(false);
	const [toastDuration, setToastDuration] = useState(3000);
	const [toastMessage, setToastMessage] = useState('');

	const showToast = (message: string, durationMs: number = 3000) => {
		setToastMessage(message);
		setToastDuration(durationMs);
		setIsToastOpen(true);
	};

	return <HelperContext.Provider value={{ showToast, isToastOpen, toastDuration, toastMessage, setIsToastOpen }}>{children}</HelperContext.Provider>;
};

export const useHelperContext = () => {
	return useContext(HelperContext);
};

export default HelperProvider;
