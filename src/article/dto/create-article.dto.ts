import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    body: string;

    @ApiProperty()
    author: string;
}
