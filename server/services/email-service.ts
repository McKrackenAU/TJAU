import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

// Initialize email transporter
function initializeTransporter() {
  if (transporter) return transporter;

  // Check for production email credentials
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Email service initialized with production credentials');
  } else {
    // Use test account for development
    transporter = nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'testpassword',
      },
    });
    console.log('Email service initialized with test account');
  }

  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const emailTransporter = initializeTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@tarotjourney.com',
      to,
      subject,
      html,
    };

    const info = await emailTransporter.sendMessage(mailOptions);
    
    // In development, log the preview URL
    if (!process.env.EMAIL_HOST) {
      console.log('Email sent successfully (test mode)');
      console.log('Preview URL: https://ethereal.email/message/' + info.messageId);
    } else {
      console.log('Email sent successfully to:', to);
    }
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    const emailTransporter = initializeTransporter();
    await emailTransporter.verify();
    console.log('Email service connection verified');
    return true;
  } catch (error) {
    console.error('Email service connection failed:', error);
    return false;
  }
}

// Legacy export for newsletter service compatibility
export async function initializeEmailService(): Promise<void> {
  initializeTransporter();
}

// Newsletter sending function
export async function sendNewsletterToSubscribers(subscribers: Array<{email: string}>, subject: string, html: string): Promise<{sent: number, failed: number}> {
  let sent = 0;
  let failed = 0;
  
  for (const subscriber of subscribers) {
    const success = await sendEmail(subscriber.email, subject, html);
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }
  
  return { sent, failed };
}