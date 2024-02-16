import { registrationEmailTemplate, subscriptionEmailTemplate, subscriptionUpdatedEmailTemplate } from '@/app/utils/email-templates';
import { PlanEnum } from '@/app/utils/enums';
import { EmailResponse } from '@/app/utils/interfaces';
import { Resend } from 'resend';

const NO_REPLY_EMAIL = 'noreply@brain-stack.com';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

// REPLACE App with the name of your app
export const sendRegistrationEmail = async (emailTo: string, trainername: string): Promise<EmailResponse> => {
  const send = await resend.emails.send({
    from: NO_REPLY_EMAIL,
    to: emailTo,
    subject: 'App Registration',
    html: registrationEmailTemplate(trainername),
  });

  return send;
};

export const sendSubscriptionEmail = async (emailTo: string, trainername: string, plan: PlanEnum): Promise<EmailResponse> => {
  const send = await resend.emails.send({
    from: NO_REPLY_EMAIL,
    to: emailTo,
    subject: 'App Subscription',
    html: subscriptionEmailTemplate(trainername, plan),
  });

  return send;
};

export const sendSubscriptionUpdatedEmail = async (emailTo: string, trainername: string, plan: PlanEnum): Promise<EmailResponse> => {
  const send = await resend.emails.send({
    from: NO_REPLY_EMAIL,
    to: emailTo,
    subject: 'App Subscription Updated',
    html: subscriptionUpdatedEmailTemplate(trainername, plan),
  });

  return send;
};

export const sendRefundEmail = async (emailTo: string, trainername: string): Promise<EmailResponse> => {
  const send = await resend.emails.send({
    from: NO_REPLY_EMAIL,
    to: emailTo,
    subject: 'App Refund',
    html: `Hi ${trainername}, <br /> <br /> Your subscription has been refunded. <br /> <br /> Thank you for using Brain Stack!`,
  });

  return send;
};

export const sendVerificationEmail = async (emailTo: string, token: string): Promise<EmailResponse> => {
  const send = await resend.emails.send({
    from: NO_REPLY_EMAIL,
    to: emailTo,
    subject: 'App Email Verification',
    html: `Hi, <br /> <br /> Please verify your email by clicking the link below: <br /> <br /> <a href="${process.env.BASE_URL}/auth/verify-email?token=${token}">Verify Email</a>`,
  });

  return send;
};
