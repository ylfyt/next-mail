export const getFileExtension = (
	file: File
): {
	ext: string;
	name: string;
} => {
	const info = file.name.split('.');
	if (info.length === 1)
		return {
			ext: '',
			name: '',
		};

	const ext = info.pop();

	return {
		ext: ext!,
		name: info.join('.'),
	};
};
