import { IonIcon } from '@ionic/react';
import { documentAttachSharp } from 'ionicons/icons';
import { FC, useRef } from 'react';
import { useHelperContext } from '../contexts/helper';

interface InputTextWithFileProps {
	value: string;
	placeholder?: string;
	setValue: (value: React.SetStateAction<string>) => void;
}

const InputTextWithFile: FC<InputTextWithFileProps> = ({ value, setValue, placeholder }) => {
	const { showToast } = useHelperContext();

	const fileRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex items-center">
			<input
				onChange={(e) => {
					setValue(e.target.value);
				}}
				value={value}
				type="text"
				placeholder={placeholder}
				className="h-[40px] px-4 text-slate-600 relative bg-white rounded-l-lg text-sm border-2 border-e-0 border-slate-400 border-solid outline-none focus:outline-none focus:ring"
			/>

			<input
				onChange={async (e) => {
					const file = e.target.files?.[0];
					if (!file) {
						return;
					}
					e.target.value = '';

					const FILE_SIZE_LIMIT = 0.5; // MB
					if (file.size > FILE_SIZE_LIMIT * 1024 * 1024) {
						showToast(`File should be less than ${FILE_SIZE_LIMIT}MB`);
						return;
					}

					const text = await file.text();
					setValue(text);
				}}
				type="file"
				ref={fileRef}
				style={{ display: 'none' }}
			/>
			<button
				className="text-xl text-slate-500 h-[40px] w-[40px] border-2 border-slate-400 border-solid focus:outline-none rounded-r-lg flex items-center justify-center"
				onClick={() => {
					fileRef.current?.click();
				}}
			>
				<IonIcon icon={documentAttachSharp} />
			</button>
		</div>
	);
};

export default InputTextWithFile;
