import { FC, ReactNode } from 'react';
import Spinner from './spinner';

interface LoadingButtonProps {
	children?: ReactNode;
	loading?: boolean;
	className?: string;
	disabled?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const LoadingButton: FC<LoadingButtonProps> = ({ children, loading = false, className, onClick, disabled }) => {
	return (
		<button disabled={loading || disabled} onClick={onClick} className={`${className} relative disabled:cursor-not-allowed disabled:opacity-80 outline-none`}>
			{loading && <Spinner className="fill-color0 absolute top-0 bottom-0 mt-auto mb-auto right-0 left-0 mr-auto ml-auto" />}
			<span className={`${!loading ? 'visible' : 'invisible'}`}>{children}</span>
		</button>
	);
};

export default LoadingButton;
