import { IAttachment } from './attachment';
import { IUserInfo } from './user-info';

export interface IMail {
	id?: string;
	senderInfo: IUserInfo;
	receiverId: string;
	subject: string;
	body: string;
	attachments: IAttachment[];
	createdAt: number;
	readAt?: number;
}
