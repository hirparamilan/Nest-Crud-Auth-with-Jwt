import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';

@ApiTags('Article')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  
  @HttpCode(201)
  @Post('articles')
  @ApiOperation({
    summary: 'Create an Article',
    description: 'API to create a new article',
  })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get('articles')
  @ApiOperation({
    summary: 'Get all the Article',
    description: 'API to get all the Article',
  })
  findAll() {
    return this.articleService.findAll();
  }

  @Get('articles/:id')
  @ApiOperation({
    summary: 'Get one Article',
    description: 'API to get one Article',
  })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch('articles/:id')
  @ApiOperation({
    summary: 'Update an Article',
    description: 'API to update an Article',
  })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete('articles/:id')
  @ApiOperation({
    summary: 'Delete an Article',
    description: 'API to delete an article',
  })
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
