import { ref, uploadBytes } from 'firebase/storage';
import { IAttachment } from '../interfaces/attachment';
import { storage } from './firebase';
import { getFileExtension } from './get-file-extension';
import { v4 } from 'uuid';

export const uploadFiles = async (files: FileList, senderId: string, receiverId: string): Promise<IAttachment[] | string> => {
	try {
		const uploaded: IAttachment[] = [];

		for (const file of files) {
			const fileExt = getFileExtension(file);
			const fileName = v4();
			const path = `attachments/${senderId}:${receiverId}/${fileName}.${fileExt.ext}`;

			const storageRef = ref(storage, path);
			const res = await uploadBytes(storageRef, file);

			if (!res) {
				return 'Failed to upload attachments';
			}
			uploaded.push({
				fileName: `${fileName}.${fileExt.ext}`,
				originalFileName: fileExt.name,
			});
		}

		return uploaded;
	} catch (error) {
		if (error instanceof Error) return error.message;
		return 'Failed to upload attachments';
	}
};
