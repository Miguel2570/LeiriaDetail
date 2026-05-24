import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';

if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY is not defined in .env file');
}

const resend = new Resend(resendApiKey);

export async function sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
    try {
        const result = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'LeiriaDetail <noreply@leiriadetail.pt>',
            to: [to],
            subject,
            html: body,
        });

        if ((result as any)?.error) {
            return {
                success: false,
                error: (result as any).error.message || 'Unknown Resend error'
            };
        }

        console.log(`📧 Email sent successfully to ${to}`);
        return { success: true };
    } catch (error: any) {
        console.error('❌ Email send failed:', error);
        return {
            success: false,
            error: error?.message || 'Unknown email send error'
        };
    }
}

export async function sendVerificationEmail(to: string, token: string, firstName: string): Promise<{ success: boolean; error?: string }> {
    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;
    
    const subject = "Verify your email - LeiriaDetail";
    const body = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #ff8c00;">Welcome to LeiriaDetail, ${firstName}!</h2>
                <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" 
                       style="background-color: #ff8c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Verify Email
                    </a>
                </div>
                <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
                <p>This link will expire in 24 hours.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
                <p style="font-size: 12px; color: #666;">Best regards,<br><strong>LeiriaDetail Team</strong></p>
            </div>
        </body>
        </html>
    `;
    
    return await sendEmail(to, subject, body);
}

export async function sendPasswordResetEmail(to: string, token: string, firstName: string): Promise<{ success: boolean; error?: string }> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const subject = "Reset your password - LeiriaDetail";
    const body = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #ff8c00;">Hello ${firstName}!</h2>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background-color: #ff8c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
                <p>This link will expire in 15 minutes.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
                <p style="font-size: 12px; color: #666;">Best regards,<br><strong>LeiriaDetail Team</strong></p>
            </div>
        </body>
        </html>
    `;
    
    return await sendEmail(to, subject, body);
}

export async function sendWelcomeEmail(to: string, firstName: string): Promise<{ success: boolean; error?: string }> {
    const subject = "Welcome to LeiriaDetail!";
    const body = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Welcome</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #ff8c00;">Welcome to LeiriaDetail, ${firstName}! 🎉</h2>
                <p>Your account has been successfully verified.</p>
                <p>You can now:</p>
                <ul>
                    <li>Book our detailing services</li>
                    <li>Manage your vehicles</li>
                    <li>Track your bookings</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/dashboard" 
                       style="background-color: #ff8c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Go to Dashboard
                    </a>
                </div>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">Best regards,<br><strong>LeiriaDetail Team</strong></p>
            </div>
        </body>
        </html>
    `;
    
    return await sendEmail(to, subject, body);
}