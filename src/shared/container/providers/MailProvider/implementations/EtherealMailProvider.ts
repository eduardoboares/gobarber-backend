import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
        // nodemailer.createTestAccount().then(account => {
        //     const transporter = nodemailer.createTransport({
        //         host: account.smtp.host,
        //         port: account.smtp.port,
        //         secure: account.smtp.secure,
        //         auth: {
        //             user: account.user,
        //             pass: account.pass
        //         }
        //     });

        //     this.client = transporter;
        // });

        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '5e0b452710a7b4',
                pass: 'cfc0d87d5d7670'
            }
        });

        this.client = transporter;
    }

    public async sendMail({
        to,
        from,
        subject,
        templateData
    }: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: from?.name || 'Equipe GoBarber',
                address: from?.email || 'equipe@gobarber.com.br'
            },
            to: {
                name: to.name,
                address: to.email
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData)
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}
