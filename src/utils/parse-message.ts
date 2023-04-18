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

	let attachmentMessage = '';
	let signature = '';

	if (data.length === 3) {
		let str = data[2];
		if (str.startsWith('<#ds>')) {
			signature = str.replace('<#ds>', '');
		} else {
			attachmentMessage = str;
		}
	} else if (data.length === 4) {
		attachmentMessage = data[2];
		signature = data[3];
	}

	if (attachmentMessage !== '') {
		const attachmentData = attachmentMessage.split('<***>');
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
		signature,
	};

	return signed;
};
