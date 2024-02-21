import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from 'src/users/dto/refresh-token-dto';
// import { OAuth2Client } from 'google-auth-library';
// import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private userService: UsersService,
  ) { }

  // async verifyFacebookAccessToken(Token: string) {
  //   const params = {
  //     access_token: Token,
  //     fields: 'email,name',
  //   };
  //   const { data } = await axios.get('https://graph.facebook.com/me', {
  //     params,
  //   });

  //   // Extract the user email and ID from the Facebook response data
  //   const { email, id } = data;

  //   // Update or create a user in the database
  //   let user = await this.userService.findOne(email);
  //   if (!user) {
  //     user = new User();
  //     user.email = email;
  //     user = await this.userService.createUser(user);
  //   }
  //   // Generate an access token using the user ID and email from the database
  //   const jwt = this.jwtService.sign(
  //     { id: user._id, email: user.email },
  //     { secret: 'creative-genius', expiresIn: '24h' },
  //   );

  //   return {
  //     status: HttpStatus.OK,
  //     message: 'user login successfully',
  //     user: {
  //       email: user.email,
  //     },
  //     accessToken: jwt,
  //   };
  // }

  // async verifyGoogleAccessToken(token: string, clientId: string) {
  //   const client = new OAuth2Client(clientId);
  //   const ticket = await client.verifyIdToken({
  //     idToken: token,
  //     audience: clientId,
  //   });
  //   const payload = ticket.getPayload();
  //   let user = await this.userService.findOne(payload.email);
  //   if (!user) {
  //     user = new User();
  //     user.email = payload.email;
  //     await this.userService.createUser(user);
  //   }
  //   const jwt = this.jwtService.sign(
  //     {
  //       id: user._id,
  //       email: user.email,
  //     },
  //     {
  //       secret: 'creative-genius',
  //       expiresIn: '24h',
  //     },
  //   );
  //   return {
  //     status: HttpStatus.OK,
  //     message: 'successfully login user',
  //     user: {
  //       email: user.email,
  //     },
  //     accessToken: jwt,
  //   };
  // }

  async signupUser(createUserDto) {
    // Check if the email is already registered
    console.log("received mail = " + createUserDto.email)
    console.log("received password = " + createUserDto.password)
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    console.log("existingUser = " + existingUser)
    if (existingUser) {
      return { status: HttpStatus.OK, message: 'Email is already exist, Please try with different one.' };
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(createUserDto.password, 10);

    // Create a new user
    const newUser = new User();
    newUser.name = createUserDto.name;
    newUser.email = createUserDto.email;
    newUser.password = hashedPwd;

    // Save the user to the database
    const savedUser = await this.userModel.create(newUser);
    const saveUser = await savedUser.save();

    // Return the user details without the password
    const { password: pwd, ...result } = saveUser;
    return {
      status: HttpStatus.OK,
      message: 'user register successfully',
      data: { id: saveUser.id, name: saveUser.name, email: saveUser.email },
    };
  }

  async loginUser(email: string, password: string) {
    // Find the user by email
    const user = await this.userModel.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Account not found',
        },
        HttpStatus.OK,
      );
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
        },
        HttpStatus.OK,
      );
    }
    // Generate an access token
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET, expiresIn: '1w'
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET, expiresIn: '7w'
    });

    user.refresh_tokens.push(refreshToken)
    user.save()
    // Return the access token
    return {
      status: HttpStatus.OK,
      message: 'User logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(token) {
    const userId = await this.getUserIdFromToken(token)
    // console.log("userId = " + userId)
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        status: HttpStatus.OK,
        message: 'Refresh token was expired. Please make a new signin request',
      };
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET, expiresIn: '1w'
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET, expiresIn: '7w'
    });

    user.refresh_tokens.push(refreshToken)
    // user.save()

    // const id = user.refresh_tokens.indexOf(token);
    // console.log("removed token id = " + id)
    user.refresh_tokens.splice(user.refresh_tokens.indexOf(token), 1)
    // console.log("received token = " + token)
    // console.log("removed token = " + removedToken)

    await this.userModel.findByIdAndUpdate({ _id: userId, refresh_tokens: user.refresh_tokens })
    // console.log(a)

    return {
      status: HttpStatus.OK,
      message: 'Token refreshed successfully',
      accessToken,
      refreshToken,
    };
  }

  async getUserIdFromToken(token) {
    const decodedJwt = this.jwtService.decode(token) as any;
    console.log("decodedJwt = " + decodedJwt.id)
    return decodedJwt?.id;
  }
}
