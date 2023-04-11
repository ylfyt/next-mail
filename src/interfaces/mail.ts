import { IAttachment } from './attachment';

export interface IMail {
	id?: string;
	senderId: string;
	receiverId: string;
	subject: string;
	body: string;
	attachments: IAttachment[];
}
