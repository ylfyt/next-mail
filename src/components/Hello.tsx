import { useState } from 'react';
import './Hello.css';
import { uploadFiles } from '../utils/upload-file';
import { useRootContext } from '../contexts/root';
import { useHelperContext } from '../contexts/helper';

interface HelloProps {}

const Hello: React.FC<HelloProps> = () => {
	const [files, setFiles] = useState<FileList | null>(null);

	const { user } = useRootContext();
	const { showToast } = useHelperContext();

	const upload = async () => {
		if (files == null || files.length === 0) return;
		const fileNames = await uploadFiles(files, 'ok', 'ok');

		if (typeof fileNames === 'string') {
			showToast(fileNames);
			return;
		}

		console.log(fileNames);
		showToast(`Uploaded ${fileNames.length} files`);
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
