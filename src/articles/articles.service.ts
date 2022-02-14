import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthDto } from '../auth/dto';
import { Auth } from '../auth/entities/auth.entity';
import { Request } from 'express';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private connection: Connection,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {
  }

  findAll() {
    return this.articleRepository.find();
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne(id);

    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }

    return article;
  }

  async create(createArticleDto: CreateArticleDto, req:Request) {

    const newRecipe =await  this.articleRepository.create({
      ...createArticleDto,
      auth: req.user
      }

    )
    return this.articleRepository.save(newRecipe)

  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    console.log('update');
    const article = await this.articleRepository.preload({
      id: +id,
      ...updateArticleDto,
    });
    console.log(article);
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }

    return this.articleRepository.save(article);
  }

  async remove(id: string) {
    const article = await this.articleRepository.findOne(id);
    console.log(article);
    return this.articleRepository.remove(article);
  }

  async saveAuthId(createArticleDto: CreateArticleDto, auth: Auth) {
    console.log('weszło');
    const { title, lead, body } = createArticleDto;

    console.log('weszło w saveAuth');
    const newArticleDto = this.articleRepository.create({
      title,
      lead,
      body,
      auth,
    });

    console.log(newArticleDto);
    return this.articleRepository.save(newArticleDto);
  }

}

