import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserRole } from 'src/users/enums/user-role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { BlacklistGuard } from 'src/auth/blacklist.guard';
import { Project } from 'src/models/project.entity';
import { User } from 'src/models/user.entity';
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/workplace/:id/users')
  public async getUsers(@Param('id') id: string): Promise<any> {
    return await this.adminService.getUsers(+id);
  }

  @Put('/workplace/:id/vertical')
  //@UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async changeVertical(
    @Param('id') id: string,
    @Body() vertical: any,
  ): Promise<any> {
    return await this.adminService.changeVertical(+id, vertical);
  }

  @Put('/workplace/:id/horizontal')
  //@UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async changeHorizontal(
    @Param('id') id: string,
    @Body() horizontal: any,
  ): Promise<any> {
    return await this.adminService.changeHorizontal(+id, horizontal);
  }

  @Put('/workplace/:id/treshhold')

  public async changeTreshhold(
    @Param('id') id: string,
    @Body() treshhold: any,
  ): Promise<any> {
    return await this.adminService.changetreshhold(+id, treshhold);
  }

  @Put('workplace/:id/floorplan')
  public async changeFloorPlan(
    @Param('id') id: string,
    @Body() floorplan: number,
  ): Promise<any> {
    return await this.adminService.changeFloorPlan(+id, floorplan);
  }


  @Post('project/:projectid/user/:userid')
  public async assingUserToProject(
    @Param('projectid') projectid: string,
    @Param('userid') userid: string,
  ) {
    return await this.adminService.assingUserToProject(+projectid, +userid);
  }

  @Put('/desk/:deskid/user/:userid')
  public async assingUserToDesk(
    @Param('deskid') deskid: string,
    @Param('userid') userid: string,
  ) {
    return await this.adminService.assignUserToDesk(+deskid, +userid);
  }

  @Put('/updateUser')
  async updateUserProp(@Body() user: any) {
    return await this.adminService.updateUserProp(user);
  }
}
