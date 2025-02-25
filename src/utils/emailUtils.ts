import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email: string, code: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "lsoft12oo0@gmail.com",
            pass: "ebouztbxezugzpuu",
        },
    });

    const mailOptions = {
        from: `"Soporte" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Para restablecer tu contraseña, usa este código de verificación: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};
