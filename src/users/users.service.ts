import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }
  // async create(createUserDto: CreateUserDto) {

  //   const emailValidation = await this.userModel.findOne({ email: createUserDto.email })
  //   if (emailValidation) {
  //     return {
  //       status: 400,
  //       message: 'Email is already exist, Please try with different one.'
  //     }
  //   }

  //   const data = await this.userModel.create(createUserDto)
  //   const passwordValidation = createUserDto.password
  //   if (passwordValidation.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{10,})")) {
  //     return {
  //       status: 200,
  //       message: 'User Created Successfully',
  //       data: data
  //     }
  //   }
  //   else {
  //     return {
  //       status: 400,
  //       message: 'Password is not correct, Please enter correct password.'
  //     }
  //   }
  // }

  async findAll() {
    const data = await this.userModel.find().select('-password').select('-refresh_tokens')
    return {
      status: 200,
      message: 'Users Get Successfully',
      data: data
    }
  }

  async findOne(id) {
    const data = await this.userModel.findById(id)
    return {
      status: 200,
      message: 'User Get Successfully',
      data: data
    }
  }

  async update(id, updateUserDto) {
    const data = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
    return {
      status: 200,
      message: 'User Updated Successfully',
      data: data
    }
  }

  async remove(id) {
    const data = await this.userModel.findByIdAndDelete(id)
    return {
      status: 200,
      message: 'User Deleted Successfully',
      data: data
    }
  }
}
