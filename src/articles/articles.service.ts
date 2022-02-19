import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Article} from './entities/article.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {CreateArticleDto} from './dto/create-article.dto';
import {UpdateArticleDto} from './dto/update-article.dto';
import {AuthDto} from '../auth/dto';
import {Auth} from '../auth/entities/auth.entity';
import {Express, Request} from 'express';
import {CreatePhotoEvent} from './create-photo-event';
import {ClientProxy} from '@nestjs/microservices';
import {CreatePhotoRequestDto} from './create-photo-request-dto';
import * as fs from 'fs';
import {CreateArticleEvent} from './events/create.article.event';
import {JwtService} from '@nestjs/jwt';
// const {writeFile} = require('fs').promises
//@TODO napisac funkcję, w której po podaniu id użytkownia znajdzie wszystkie artykuły przez niego napisane
@Injectable()
export class ArticlesService {


    constructor(
        protected readonly jwtService: JwtService,
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
        private connection: Connection,
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
        @Inject('PHOTOS') private readonly photosClient: ClientProxy
    ) {
    }

    // TEST
    async createArticleAndSendPhoto(createArticleDto: CreateArticleDto, files: Array<Express.Multer.File>, req: Request) {

        //create Article and give article Id
        const newRecipe = await this.articleRepository.create({
            ...createArticleDto,
            auth: req.user
        })
        const createArticle = await this.articleRepository.save(newRecipe);
        const articleDate = Object.entries(createArticle);
        const articleId = articleDate[4][1];

        //

        //encoded jwt token,
        // const authHeader = req.headers.authorization;
        // const token = authHeader.substring(7, authHeader.length)
        // const decoded = this.jwtService.decode(token, {complete: true});
        // const articleSub = decoded['payload'].sub;

        //take id from sending token with article. Article have id from token, so id will be send to photo that it also have the same id


        //wywołaj zdarzenie do mikroserwisu gdy user się stworzy,
        this.photosClient.emit('user_created', new CreateArticleEvent(createArticleDto.title, createArticleDto.lead, createArticleDto.body, articleId));

        //
        const fileData = files[0]
        this.photosClient.emit({cmd: 'get_photos'}, {fileData, articleId});

        //@TODO  create article, update dto (lead,body,title)

        return articleDate
    }


    async remove(id: string) {
        const article = await this.articleRepository.findOne(id);
        console.log(article);

        // send article id to the photo app and find aticleId in photo and delete row
        this.photosClient.emit({cmd: 'delete_photo'}, {id});

        return this.articleRepository.remove(article);
    }

    downloadPhotoFromArticle(id: string,) {
        const data = '1asdasdasda'
        this.photosClient.emit({cmd: 'download_photo'}, {id});
        return data
    }


    createMessage() {
        return this.photosClient.emit({cmd: 'get_photos'}, {});
    }

    //
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

    async findArticlesWrittenByUser(id: number) {
        return this.articleRepository.find({relations: ['auth'], where: {auth: id}});

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


    async saveAuthId(createArticleDto: CreateArticleDto, auth: Auth) {
        console.log('weszło');
        const {title, lead, body} = createArticleDto;

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

    //na potem, jakbym jednak chciał tworzyć sam artykuł
    // async create(createArticleDto: CreateArticleDto, req:Request) {
    //
    //   const newRecipe =await  this.articleRepository.create({
    //       ...createArticleDto,
    //       auth: req.user
    //     }
    //
    //   )
    //   return this.articleRepository.save(newRecipe)
    // }

}

