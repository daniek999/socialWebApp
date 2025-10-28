import 'dotenv/config';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS, },
});


export const sendVerificationMail = async (email, token) => {

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

    const verificationMail = {
        from: `"Soporte" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta en SWA',
        html: `
            <h3>Verifica tu correo electrónico</h2>
            <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
            <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
            <p>Este enlace expirará en 15 minutos.</p>
        `
    };

    await transporter.sendMail(verificationMail);
};
