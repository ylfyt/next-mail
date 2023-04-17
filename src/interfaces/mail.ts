import { IUserInfo } from './user-info';

export interface IMail {
	id?: string;
	senderInfo: IUserInfo;
	receiverId: string;
	message: string;
	isEncrypted: boolean;
	createdAt: number;
	readAt?: number;
}
