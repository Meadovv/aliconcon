const nodemailer = require('nodemailer');

const Utils = require('../utils');

class MailerService {
    static transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: process.env.MAILER_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.MAILER_USERNAME,
            pass: process.env.MAILER_PASSWORD
        },
        tls: {
            // This will force the connection to use only TLSv1.2
            minVersion: 'TLSv1.2'
        }
    });

    static sendVerificationEmail = ({ to, name, key }) => {
        const htmlContent = Utils.OtherUtils.generateVerificationHTMLContent({ email: to, name, key });
        const options = {
            from: {
                name: process.env.MAILER_FROM_NAME,
                address: process.env.MAILER_FROM_ADDRESS
            },
            to: to,
            subject: 'Email Verification',
            html: htmlContent
        }

        return this.transporter.sendMail(options);
    }

}

module.exports = MailerService;