// Simple Email Service for artist notifications
// This is a mock implementation that simulates email sending
// In production, you would integrate with a real email service

class EmailService {
  constructor() {
    this.fromEmail = 'noreply@eventflow.com';
  }

  // Mock email sending - in production, integrate with a real email service
  async sendEmail({ to, subject, html, text }) {
    console.log('📧 Sending email:', { to, subject });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log email content for debugging
    console.log('Email content:', html || text);
    
    // In production, replace this with actual email service integration
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  async sendArtistApprovalEmail(artistData) {
    const { email, fullName, stageName } = artistData;
    
    const subject = '🎉 Your EventFlow Artist Application has been Approved!';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Artist Application Approved</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .credentials {
              background: white;
              padding: 20px;
              border-radius: 6px;
              border-left: 4px solid #28a745;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your Artist Application has been Approved</p>
          </div>
          
          <div class="content">
            <p>Dear ${fullName || stageName},</p>
            
            <p>We're excited to inform you that your artist application for <strong>EventFlow</strong> has been approved! Welcome to our community of talented performers.</p>
            
            <div class="credentials">
              <h3>Your Account is Now Active:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Status:</strong> Approved Artist</p>
              <p><strong>Stage Name:</strong> ${stageName}</p>
            </div>
            
            <p>You can now:</p>
            <ul>
              <li>✅ Browse and apply to upcoming events</li>
              <li>✅ Manage your artist profile</li>
              <li>✅ Upload portfolio materials</li>
              <li>✅ Track your application status</li>
              <li>✅ Connect with event organizers</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${window.location.origin}/artist-portal-dashboard" class="button">
                Access Your Artist Dashboard
              </a>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
            
            <p>Welcome aboard!</p>
            <p><strong>The EventFlow Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} EventFlow. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  async sendArtistRejectionEmail(artistData, reason = '') {
    const { email, fullName, stageName } = artistData;
    
    const subject = 'EventFlow Artist Application Update';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Artist Application Status</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #6c757d;
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .reason-box {
              background: white;
              padding: 20px;
              border-radius: 6px;
              border-left: 4px solid #ffc107;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Artist Application Update</h1>
          </div>
          
          <div class="content">
            <p>Dear ${fullName || stageName},</p>
            
            <p>Thank you for your interest in joining EventFlow as a performing artist. After careful review of your application, we regret to inform you that we cannot approve your application at this time.</p>
            
            ${reason ? `
              <div class="reason-box">
                <h3>Feedback:</h3>
                <p>${reason}</p>
              </div>
            ` : ''}
            
            <p>This decision doesn't reflect on your talent or abilities. We encourage you to:</p>
            <ul>
              <li>📝 Review and update your portfolio</li>
              <li>🎯 Gain more performance experience</li>
              <li>🔄 Reapply in the future</li>
              <li>👥 Continue engaging with the music community</li>
            </ul>
            
            <p>You're welcome to reapply after 30 days with updated materials. We appreciate your understanding and wish you the best in your musical journey.</p>
            
            <div style="text-align: center;">
              <a href="${window.location.origin}/artist-application-form" class="button">
                Submit New Application
              </a>
            </div>
            
            <p>If you have questions about this decision, please contact our support team.</p>
            
            <p>Best regards,</p>
            <p><strong>The EventFlow Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} EventFlow. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  async sendWelcomeEmail(userData) {
    const { email, fullName, role } = userData;
    
    const subject = `Welcome to EventFlow${role === 'artist' ? ' - Complete Your Artist Profile' : ''}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to EventFlow</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎵 Welcome to EventFlow!</h1>
          </div>
          
          <div class="content">
            <p>Dear ${fullName},</p>
            
            <p>Thank you for joining EventFlow, the premier platform for musical event management!</p>
            
            ${role === 'artist' ? `
              <p>As an artist, you'll need to complete your application to start performing at events:</p>
              <ul>
                <li>📋 Complete your artist application form</li>
                <li>🎼 Upload your portfolio and samples</li>
                <li>⏳ Wait for admin approval</li>
                <li>🎉 Start applying to events once approved</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${window.location.origin}/artist-application-form" class="button">
                  Complete Artist Application
                </a>
              </div>
            ` : `
              <p>As an event attendee, you can now:</p>
              <ul>
                <li>🎪 Discover amazing musical events</li>
                <li>🎫 Book tickets to your favorite performances</li>
                <li>❤️ Follow your favorite artists</li>
                <li>📅 Manage your event calendar</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${window.location.origin}/user-portal-dashboard" class="button">
                  Explore Events
                </a>
              </div>
            `}
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Welcome to the EventFlow community!</p>
            <p><strong>The EventFlow Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} EventFlow. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html
    });
  }
}

export const emailService = new EmailService();
export default emailService;