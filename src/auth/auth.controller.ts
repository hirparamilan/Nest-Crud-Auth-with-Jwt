import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from 'src/users/dto/refresh-token-dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Authentication')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @HttpCode(200)
  // @Get('facebook-verify/:token')
  // async verifyFacebookAccessToken(@Query('Token') Token: string) {
  //   return await this.authService.verifyFacebookAccessToken(Token);
  // }

  // @HttpCode(200)
  // @Get('google-verify/:token')
  // async verifyGoogleToken(@Param('token') token: string) {
  //   return await this.authService.verifyGoogleAccessToken(
  //     token,
  //     process.env.CLIENT_ID,
  //   );
  // }

  @HttpCode(201)
  @Post('register')
  @ApiOperation({
    summary: 'Regiser a User',
    description: 'API to register a new User',
  })
  signupUser(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.authService.signupUser(createUserDto);
  }

  @HttpCode(200)
  @Post('login')
  loginUser(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    return this.authService.loginUser(email, password);
  }

  @HttpCode(200)
  @Post('refresh')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    // if (!refreshTokenDto.token) {
    //   return {
    //     status: HttpStatus.BAD_REQUEST,
    //     message: 'Please provide a token'
    //   }
    // }
    return this.authService.refresh(refreshTokenDto.token);
  }
}
