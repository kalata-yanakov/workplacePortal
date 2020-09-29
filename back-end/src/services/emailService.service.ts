import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wokrplacebg@gmail.com',
      pass: 'bodli4ka',
    },
  });

  async sendSchedule(email: string[]): Promise<any> {
    return await this.transporter.sendMail({
      from: 'wokrplacebg@gmail.com',
      to: email,
      subject: 'Check you schedule for next week',
      text:
        'Dear employee, in regards to current COVID-19 restrictions, do not forget to check your schedule for next week. '
    });
  }
}
