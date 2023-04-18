import { IAttachment } from './attachment';

export interface IMessage {
	subject: string;
	body: string;
	attachments: IAttachment[];
}

export interface ISignedMessage {
	message: IMessage;
	signature: string;
}
