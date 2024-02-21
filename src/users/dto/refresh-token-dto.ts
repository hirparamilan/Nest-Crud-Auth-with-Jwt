import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty({ always: true, message: 'Please provide a token' })
    token: string;
}