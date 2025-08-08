import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { logger } from '../utility/logger.js';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, code) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }
    if (!process.env.VERIFIED_SENDER_EMAIL) {
      throw new Error('VERIFIED_SENDER_EMAIL is not configured');
    }

    const msg = {
      to: email,
      from: process.env.VERIFIED_SENDER_EMAIL,
      subject: 'Social Sphere - Email Verification',
      text: `Welcome to Social Sphere! Your verification code is: ${code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to Social Sphere!</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for joining Social Sphere! To complete your registration, please use the verification code below:
            </p>
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 32px; letter-spacing: 4px; margin: 0;">${code}</h1>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">
              This code will expire in 10 minutes for your security.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: false }
      }
    };
    
    await sgMail.send(msg);
    logger.audit('Verification email sent successfully', { to: email });
    
  } catch (error) {
    logger.error('Email sending failed', {
      to: email,
      from: process.env.VERIFIED_SENDER_EMAIL,
      errorMessage: error.message
    });
    
    if (error.response) {
      logger.error('SendGrid API error', {
        status: error.response.status,
        statusText: error.response.statusText,
        body: error.response.body
      });
    }
    
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};