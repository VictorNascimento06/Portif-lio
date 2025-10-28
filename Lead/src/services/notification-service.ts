import nodemailer from 'nodemailer';
import { ILead } from '../models';
import { logger } from '../utils/logger';

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async notifyHotLead(lead: ILead, qualification: any): Promise<void> {
    try {
      const subject = `🔥 HOT LEAD: ${lead.name || lead.phone} - Score ${qualification.score}/10`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff4444;">🔥 Hot Lead Detected!</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Lead Information</h3>
            <p><strong>Name:</strong> ${lead.name || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Email:</strong> ${lead.email || 'Not provided'}</p>
            <p><strong>Company:</strong> ${lead.metadata?.company || 'Not provided'}</p>
            <p><strong>Score:</strong> ${qualification.score}/10</p>
            <p><strong>Temperature:</strong> ${qualification.temperature.toUpperCase()}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>AI Analysis</h3>
            <p><strong>Reasoning:</strong> ${qualification.reasoning}</p>
            
            <h4>Recommended Actions:</h4>
            <ul>
              ${qualification.nextActions.map((action: string) => `<li>${action}</li>`).join('')}
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.DASHBOARD_URL}/leads/${lead._id}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Lead in Dashboard
            </a>
          </div>

          <p style="color: #666; font-size: 12px;">
            This notification was sent because the lead scored ${qualification.score}/10 or was marked as ${qualification.temperature}.
          </p>
        </div>
      `;

      await this.sendEmail(subject, html);
      logger.info(`Hot lead notification sent for ${lead.phone}`);

    } catch (error) {
      logger.error('Error sending hot lead notification:', error);
    }
  }

  async notifyDailyReport(stats: {
    totalLeads: number;
    newLeads: number;
    hotLeads: number;
    conversions: number;
    responseRate: number;
  }): Promise<void> {
    try {
      const subject = `📊 Daily Lead Report - ${new Date().toLocaleDateString()}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📊 Daily Lead Report</h2>
          <p style="color: #666;">Report for ${new Date().toLocaleDateString()}</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; color: #007bff;">${stats.totalLeads}</h3>
              <p style="margin: 5px 0; color: #666;">Total Leads</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; color: #28a745;">${stats.newLeads}</h3>
              <p style="margin: 5px 0; color: #666;">New Today</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; color: #ff4444;">${stats.hotLeads}</h3>
              <p style="margin: 5px 0; color: #666;">Hot Leads</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; color: #ffc107;">${stats.conversions}</h3>
              <p style="margin: 5px 0; color: #666;">Conversions</p>
            </div>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Performance</h3>
            <p><strong>Response Rate:</strong> ${stats.responseRate.toFixed(1)}%</p>
            <p><strong>Conversion Rate:</strong> ${((stats.conversions / stats.totalLeads) * 100).toFixed(1)}%</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.DASHBOARD_URL}/dashboard" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Full Dashboard
            </a>
          </div>
        </div>
      `;

      await this.sendEmail(subject, html);
      logger.info('Daily report sent successfully');

    } catch (error) {
      logger.error('Error sending daily report:', error);
    }
  }

  private async sendEmail(subject: string, html: string): Promise<void> {
    try {
      // Get notification recipients from environment or default
      const recipients = process.env.NOTIFICATION_EMAILS?.split(',') || [process.env.EMAIL_USER];

      await this.transporter.sendMail({
        from: `"${process.env.BUSINESS_NAME || 'Lead AI'}" <${process.env.EMAIL_USER}>`,
        to: recipients.join(', '),
        subject,
        html
      });

    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}