import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailController } from 'src/controller/emailService.controller';
import { EmailService } from 'src/services/emailService.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: 'smtp://wokrplacebg@gmail.com',
      
    }),
    AuthModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailsModule {}
