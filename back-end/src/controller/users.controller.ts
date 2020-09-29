import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Param,
  UseGuards,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { BlacklistGuard } from 'src/auth/blacklist.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { UserDTO } from '../DTOS/UserDTO';
import { UserId } from 'src/auth/user-id.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  public async createUser(
    @Body(/*new ValidationPipe({ whitelist: true, })*/)
    userCredentials: UserDTO,
  ): Promise<any> {
    try {
      return await this.userService.create(userCredentials);
    } catch (error) {
      throw new Error(`Username already taken. Please try another username.`);
    }
  }

  @Put('/holiday')
  @UseGuards(BlacklistGuard)
  async holidayStart(
    @UserId() userId: number,
    @Body() HolidayStartDate: Date,
    HolidayEndDate: Date,
  ): Promise<any> {
    return await this.userService.holidayStart(
      userId,
      HolidayStartDate,
      HolidayEndDate,
    );
  }

  @Delete('/holidayCancelation')
  @UseGuards(BlacklistGuard)
  async deleteHoliday(@UserId() userId: number): Promise<any> {
    return await this.userService.deleteHoliday(userId);
  }

  @Get(':userdId/userWorkplace')
  async getUserWorkplace(@Param('userId') userId: number) {
    return await this.userService.getUserWorkplace(userId);
  }

  @Get('/userInfo')
  async getUserInfo() {
    return await this.userService.getUserInfo();
  }

  // @Get('/userInfo/:country')
  // async getUserInfo(@Param('country') countryName: string) {
  //   return await this.userService.getUsersByCountry(countryName);
  // }

  @Post(':userId/ban')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  async banUser(
    @Param('userId') userId: string,
    @Body(new ValidationPipe({ whitelist: true })) banDto: any,
  ) {
    return await this.userService.banUser(+userId, banDto.period);
  }
}
