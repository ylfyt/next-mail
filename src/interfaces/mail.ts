import { IAttachment } from './attachment';

export interface IMail {
	id?: string;
	senderId: string;
	receiverId: string;
	body: string;
	attachments: IAttachment[];
}
