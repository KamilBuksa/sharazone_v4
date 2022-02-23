import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Article} from './entities/article.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {CreateArticleDto} from './dto/create-article.dto';
import {UpdateArticleDto} from './dto/update-article.dto';
import {AuthDto} from '../auth/dto';
import {Auth} from '../auth/entities/auth.entity';
import {Express, Request, Response} from 'express';
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


        const fileData = files[0]
        this.photosClient.emit({cmd: 'get_photos'}, {fileData, articleId});

        //@TODO  create article, update dto (lead,body,title)

        return articleDate
    }


    async remove(id: string) {
        if (await this.articleRepository.findOne(id)) {
        const article = await this.articleRepository.findOne(id);
        console.log(article);

        // send article id to the photo app and find aticleId in photo and delete row
        this.photosClient.emit({cmd: 'delete_photo'}, {id});

        return this.articleRepository.remove(article);
        } else {
            return 'file does not exist'
        }
    }

    downloadPhotoFromArticle(id: string,) {
        const data = 'download photo - article service'
       return  this.photosClient.emit({cmd: 'download_photo'}, {id});
    }

    downloadPhotoMessage(body) {
        const pathToDownload = body.pathToDownloadPhoto
        console.log(pathToDownload)
        return pathToDownload
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


    updatePhoto(id,files: Array<Express.Multer.File>,){
        console.log(files)

        return  this.photosClient.emit({cmd: 'update_photo'}, {id,files});
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

