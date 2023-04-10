import { useState } from 'react';
import './Hello.css';
import { uploadFiles } from '../utils/upload-file';
import { useRootContext } from '../contexts/root';

interface HelloProps {}

const Hello: React.FC<HelloProps> = () => {
	const [files, setFiles] = useState<FileList | null>(null);

	const { user } = useRootContext();

	const upload = async () => {
		if (files == null || files.length === 0) return;
		const fileNames = await uploadFiles(files, 'ok', 'ok');

		console.log(fileNames);
	};

	return (
		<div className="container">
			<strong>Hello {user?.email} 👋</strong>
			<input
				type="file"
				multiple
				onChange={(e) => {
					setFiles(e.target.files);
				}}
			/>
			<button onClick={upload}>send</button>
		</div>
	);
};

export default Hello;
