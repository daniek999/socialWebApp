import 'dotenv/config';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
});


export const sendVerificationMail = async (email, token) => {
    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;
    await transporter.sendMail({
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
    });
};
export const sendSuspensionEmail = async (email, username, reason, until, suspendedTime) => {
    const formattedUntil = new Date(until).toLocaleString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    await transporter.sendMail({
        from: `"SWA." <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Tu cuenta ha sido suspendida`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; background-color: #fafafa;">
            <h2 style="color: #d32f2f; text-align: center;">Suspensión de cuenta</h2>
            
            <p>Hola <strong>${username}</strong>, tu cuenta ha sido suspendida temporalmente.</p>
            
            <div style="background-color: #fff3f3; border: 1px solid #f5c2c2; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Motivo:</strong> ${reason}</p>
                <p><strong>Duración:</strong> ${suspendedTime} minutos</p>
                <p><strong>Fecha de reactivación:</strong> ${formattedUntil}</p>
            </div>
            
            <p style="font-size: 12px; color: #777; text-align: center">
                Este es un mensaje automático, por favor no respondas directamente a este correo.
            </p>
            
            <p style="text-align: center; color: #aaa; font-size: 12px;">Red Social © 2025</p>
        </div>
        `
    });
};
export const sendBanEmail = async (email, username, reason) => {

    await transporter.sendMail({
        from: `"SWA." <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Tu cuenta ha sido baneada`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; background-color: #fafafa;">
            <h2 style="color: #d32f2f; text-align: center;">Baneo de cuenta</h2>
            
            <p>Hola <strong>${username}</strong>, tu cuenta ha sido baneada.</p>
            
            <div style="background-color: #fff3f3; border: 1px solid #f5c2c2; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Motivo:</strong> ${reason}</p>
            </div>
            
            <p style="font-size: 12px; color: #777; text-align: center">
                Este es un mensaje automático, por favor no respondas directamente a este correo.
            </p>
            
            <p style="text-align: center; color: #aaa; font-size: 12px;">Red Social © 2025</p>
        </div>
        `
    });
};