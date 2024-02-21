import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}