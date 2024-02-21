import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const savedArticle = await this.articleModel.create(createArticleDto);

    return {
      status: HttpStatus.OK,
      message: 'Article created Successfully',
      data: savedArticle,
    };
  }

  async findAll() {
    const data = await this.articleModel.find();
    return {
      status: 200,
      message: 'Articles Get Successfully',
      data: data,
    };
  }

  async findOne(id: string) {
    const data = await this.articleModel.findById({ _id: id });
    return {
      status: 200,
      message: 'Articles Get Successfully',
      data: data,
    };
  }

  async update(id, updateArticleDto: Partial<{ title: string; body: string; author: string }>) {
    console.log("id = " + id);

    const { title, body, author } = updateArticleDto;
  
    const updateFields = {};
  
    if (typeof title === 'string' && title.trim() !== '') {
      updateFields['title'] = title;
    }
    if (typeof body === 'string' && body.trim() !== '') {
      updateFields['body'] = body;
    }
    if (typeof author === 'string' && author.trim() !== '') {
      updateFields['author'] = author;
    }
  
    if (Object.keys(updateFields).length > 0) {
      const query = await this.articleModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
  
      return {
        status: 200,
        message: 'Article Updated Successfully',
        data: query
      };
    } else {
      // If no fields to update, return an error message or appropriate response
      return {
        status: 400,
        message: 'No fields to update.'
      };
    }
  }

  async remove(id: string) {
    const data = await this.articleModel.findByIdAndDelete({ _id: id });
    return {
      status: 200,
      message: 'Article Deleted Successfully',
    };
  }
}
