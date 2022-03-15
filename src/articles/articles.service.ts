import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Article } from "./entities/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Auth } from "../auth/entities/auth.entity";
import { Request } from "express";
import { ClientProxy } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ArticlesService {
  constructor(
    protected readonly jwtService: JwtService,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private connection: Connection,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @Inject("PHOTOS") private readonly photosClient: ClientProxy
  ) {
  }
  async createArticle(createArticleDto: CreateArticleDto, req: Request) {
    //@TODO dodaj messagePattern sprwdzający, czy photoId, które wysyłasz w body na pewno znajduje się w tabeli photo, jeżeli nie to throw new Error

    //create Article
    const newRecipe = this.articleRepository.create({
      ...createArticleDto,
      auth: req.user,
      photoId: req.body.photoId

    });
    const createArticle = await this.articleRepository.save(newRecipe);

    return createArticle;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    console.log("update");
    const article = await this.articleRepository.preload({
      id: +id,
      ...updateArticleDto
    });
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return this.articleRepository.save(article);
  }

  async deleteArticle(id) {
    if (await this.articleRepository.findOne(id)) {
      const article = await this.articleRepository.findOne(id);
      console.log(article);
      return this.articleRepository.remove(article);
    } else {
      throw new NotFoundException(`Article #${id} not found`);
    }
  }


  findAll() {
    return this.articleRepository.find();
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return article;
  }


  async findArticlesWrittenByUser(id: number) {
    if (await this.articleRepository.findOne({ where: { auth: id } })) {
      return this.articleRepository.find({ relations: ["auth"], where: { auth: id } });
    }
    throw new NotFoundException(`User #${id} does not exists`);
  }




}

