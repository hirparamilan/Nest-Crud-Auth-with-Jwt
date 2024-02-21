import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Post('register')
  // @ApiOperation({
  //   summary: 'Regiser a User',
  //   description: 'API to register a new User',
  // })
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get('user')
  @ApiOperation({
    summary: 'Get all Users',
    description: 'API to get all Users',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Get one User',
    description: 'API to get one User',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('user/:id')
  @ApiOperation({
    summary: 'Update a User',
    description: 'API to update a User',
  })
  update(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('user/:id')
  @ApiOperation({
    summary: 'Delete a User',
    description: 'API to delete a User',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}