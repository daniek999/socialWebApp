import 'dotenv/config';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS, },
});

export const sendVerificationMail = async (email, token) => {

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

    const verificationMail = {

        from: `"SWA." <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Activa tu cuenta en SWA',
        html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background: #f7f7f7; padding: 24px;">
            <div style="max-width: 480px; margin: auto; background: #ffffff; padding: 32px; border-radius: 12px;">

                <h2 style="margin-top: 0; color: #222; font-weight: 600; text-align: center;">
                    Verifica tu correo
                </h2>

                <p style="font-size: 15px; color: #444; line-height: 1.6;">
                    ¡Hola! Gracias por registrarte en <strong>SWA</strong>.
                    Antes de continuar, necesitamos confirmar que este correo realmente te pertenece.
                </p>

                <div style="margin: 28px 0; text-align: center;">
                    <a href="${verificationUrl}" 
                    target="_blank"
                    style="
                            background: #4a6cf7;
                            color: #fff;
                            padding: 12px 20px;
                            text-decoration: none;
                            border-radius: 6px;
                            font-size: 15px;
                            display: inline-block;
                            font-weight: 600;
                    ">
                        Activar cuenta
                    </a>
                </div>

                <p style="font-size: 13px; color: #555; line-height: 1.6;">
                    O si prefieres, copia y pega el siguiente enlace en tu navegador:
                </p>

                <p style="word-break: break-all; font-size: 12px; color: #3366cc;">
                    ${verificationUrl}
                </p>

                <p style="margin-top: 24px; font-size: 12px; color: #777; text-align: center;">
                    Este enlace es válido por <strong>15 minutos</strong>.
                </p>

            </div>
        </div>
        `
    };

    await transporter.sendMail(verificationMail);
};
