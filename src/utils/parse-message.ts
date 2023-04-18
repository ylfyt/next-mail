import { IAttachment } from '../interfaces/attachment';
import { IMessage, ISignedMessage } from '../interfaces/message';

export const parseMessage = (message: string): ISignedMessage | null => {
	const data = message.split('<******>');
	if (data.length < 2) {
		return null;
	}

	const subject = data[0];
	const body = data[1];

	const msg: IMessage = {
		body,
		subject,
		attachments: [],
	};

	if (data.length > 2) {
		const attachmentData = data[2].split('<***>');
		const attachments: IAttachment[] = [];
		for (const data of attachmentData) {
			const attach = data.split('<>');
			attachments.push({
				fileName: attach[0],
				originalFileName: attach[1],
				ext: attach[2],
			});
		}
		msg.attachments = attachments;
	}

	const signed: ISignedMessage = {
		message: msg,
		signature: '',
	};

	if (data.length > 3) {
		signed.signature = data[3];
	}

	return signed;
};
