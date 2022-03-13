import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Article} from './entities/article.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {CreateArticleDto} from './dto/create-article.dto';
import {UpdateArticleDto} from './dto/update-article.dto';
import {Auth} from '../auth/entities/auth.entity';
import {Express, Request, Response} from 'express';
import {ClientProxy} from '@nestjs/microservices';
import {JwtService} from '@nestjs/jwt';
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

    async createArticleAndSendPhoto(createArticleDto: CreateArticleDto, files: Array<Express.Multer.File>, req: Request) {

        //create Article and give article Id
        const newRecipe = await this.articleRepository.create({
            ...createArticleDto,
            auth: req.user
        })
        const createArticle = await this.articleRepository.save(newRecipe);
        const articleDate = Object.entries(createArticle);
        const articleId = articleDate[4][1];

//@TODO artykuł ma mieć id zdjęcia, nie przypisywać do zdjęcia id artykułu. Zdjęcie najpierw wysłać. Osobna metoda
        const fileData = files[0]
        this.photosClient.emit({cmd: 'get_photos'}, {fileData, articleId});


        return articleDate
    }

    // post photo and send photoId to article v. 12.03.20222
    async sendPhoto(files,articleId){
        const fileData = files[0];
        this.photosClient.emit({cmd: 'save_photo'}, {fileData,articleId});
    }

    // Add photoId to article table
    async addPhotoId(body){
        console.log(body, 'its me photoId - article.service')

        await this.articleRepository.createQueryBuilder()
            .update()
            .set({photoId: body.photoId})
            .where({
                id: body.articleId,
            })
            .execute()

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
       return  this.photosClient.emit({cmd: 'download_photo'}, {id});
    }

    downloadPhotoMessage(body) {
        const pathToDownload = body.pathToDownloadPhoto
        console.log(pathToDownload)
        return pathToDownload
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


    updatePhoto(id:number,files: Array<Express.Multer.File>,){
        return  this.photosClient.emit({cmd: 'update_photo'}, {id,files});
    }



}

