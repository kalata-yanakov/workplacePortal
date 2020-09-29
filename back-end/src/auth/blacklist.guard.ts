import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BlacklistGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const baseActivation = await super.canActivate(ctx);
    if (!baseActivation) {
      return false;
    }

    const request = ctx.switchToHttp().getRequest();
    const token = request.headers?.authorization?.slice(7);

    return !(await this.authService.isBlacklisted(token));
  }
}
