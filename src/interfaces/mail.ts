import { IUserInfo } from './user-info';

export interface IMail {
	id?: string;
	senderInfo: IUserInfo;
	receiverInfo: IUserInfo;
	message: string;
	isEncrypted: boolean;
	createdAt: number;
	readAt?: number;
}
