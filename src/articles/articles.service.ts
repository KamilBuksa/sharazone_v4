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


    async createArticle(createArticleDto: CreateArticleDto, req: Request) {

        //create Article and give article Id
        const newRecipe = this.articleRepository.create({
            ...createArticleDto,
            auth: req.user
        })
        const createArticle = await this.articleRepository.save(newRecipe);

        return createArticle
    }

    // post photo and send photoId to article v. 12.03.20222
    async sendPhoto(files: Array<Express.Multer.File>, articleId: number) {

        const article = await this.articleRepository.findOne({where: {id: articleId}});
        const photoId = article.photoId;
        console.log(article);
        console.log(photoId)

        if (photoId === null) {
            console.log('adsada')
            const fileData = files[0];
            this.photosClient.emit({cmd: 'save_photo'}, {fileData, articleId});
            return true
        } else {
            throw new NotFoundException(`Article #${articleId} already have a photo`);
        }


    }

    // Add photoId to article table
    async addPhotoId(body: any) {
        console.log(body, 'its me photoId - article.service')

        await this.articleRepository.createQueryBuilder()
            .update()
            .set({photoId: body.photoId})
            .where({
                id: body.articleId,
            })
            .execute()

    }


    async remove(id: number) {
        console.log('działa')
        if (await this.articleRepository.findOne(id)) {
            const article = await this.articleRepository.findOne(id);
            console.log(article);


            if (article.photoId !== null) {
                // send article id to the photo app and find aticleId in photo and delete row
                const photoId = article.photoId;
                console.log('nie null');
                this.photosClient.emit({cmd: 'delete_photo'}, {photoId});
            }
            return this.articleRepository.remove(article);
        } else {
            throw new NotFoundException(`Article #${id} not found`);
        }
    }


    async downloadPhotoFromArticle(id: number,) {

        if (!await this.articleRepository.findOne({where: {id: id}})) {
            throw new NotFoundException(`Article #${id} not found`);
            return `There is no file with ${id} ID`
        }
        const article = await this.articleRepository.findOne({where: {id: id}});
        console.log(article)
        const photoId = article.photoId
        console.log(photoId)
        return this.photosClient.emit({cmd: 'download_photo'}, {photoId});
    }

    downloadPhotoMessage(pathToDownloadPhoto: string) {
        console.log(pathToDownloadPhoto)
        return pathToDownloadPhoto
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
        if(await this.articleRepository.findOne({where:{auth:id}})){
            return this.articleRepository.find({relations: ['auth'], where: {auth: id}});
        }

        throw new NotFoundException(`User #${id} does not exists`);
    }


    async update(id: number, updateArticleDto: UpdateArticleDto) {
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


    async updatePhoto(id: number, files: Array<Express.Multer.File>,) {
        const article = await this.articleRepository.findOne({where: {id: id}})
        const photoId = article.photoId;

        return this.photosClient.emit({cmd: 'update_photo'}, {photoId, files});
    }


}

