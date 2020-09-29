import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from 'src/services/emailService.service';

@Controller('/sendEmail')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendSchedule(@Body() body: { email: string[] }): Promise<string> {
    return await this.emailService.sendSchedule(body.email);
  }
}
