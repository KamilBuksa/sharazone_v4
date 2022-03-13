import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    Query, UseGuards, Req, UseInterceptors, UploadedFiles, Res, ParseIntPipe
} from "@nestjs/common";
import {ArticlesService} from "./articles.service";
import {CreateArticleDto} from "./dto/create-article.dto";
import {UpdateArticleDto} from "./dto/update-article.dto";
import {ApiKeyGuard} from "../common/guards/api-key.guard";
import {Request, Response} from "express";
import {AnyFilesInterceptor} from "@nestjs/platform-express";
import {Express} from "express";
import {MessagePattern} from "@nestjs/microservices";

@Controller("articles")
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) {
    }


    //Guard jest po to by mieć dostęp do req.user i z rozkodowanego tokenu wziąć id, by je przypisać do tabeli article wraz z artykułem
    // Post article and save in article table
    @UseGuards(ApiKeyGuard)
    @Post()
    async createArticle(
        @Body() createArticleDto: CreateArticleDto,
        @Req() req: Request,
    ){
        console.log(createArticleDto)
        return this.articlesService.createArticle(createArticleDto, req)
    }

    // Post photo with JWT and save photoId in article table
    @UseGuards(ApiKeyGuard)
    @Post(":id/photo")
    @UseInterceptors(AnyFilesInterceptor())
    async sendPhoto(
        @Param('id', ParseIntPipe) articleId: number,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        return this.articlesService.sendPhoto(files, articleId);
    }

    @MessagePattern({cmd: 'add_photoId'})
    async addPhotoId(
        @Body() body
    ) {
        return this.articlesService.addPhotoId(body)
    }



    @Delete(":id")
    deleteArticleAndPhoto(@Param("id") id) {
        return this.articlesService.remove(id);
    }

    // ----------------------------
    //  Download photo from article
    @Get(":id/photo")
    downloadPhotoFromArticle(@Param("id",ParseIntPipe) id, @Req() req: Request) {
        console.log(id);
        return this.articlesService.downloadPhotoFromArticle(id);
    }

    // get full photo path
    @MessagePattern({cmd: "download_photo2"})
    async downloadPhotoMessage(@Body() body, @Res() res: Response) {
        return this.articlesService.downloadPhotoMessage(body);
    }
    // ----------------------------


    @Get()
    findAllArticles(@Query() paginationQuery) {
        const {limit, offset} = paginationQuery;
        return this.articlesService.findAll();
    }

    @Get(":id")
    findOneArticle(@Param("id") id: number) /* Param domyślnie jest stringiem, transform:true w Pipe umożliwia otypowanie go na number */ {
        return this.articlesService.findOne("" + id);
    }

    //if you dont want auth table to be see, just delete relations: ['auth'] in findArticlesWrittenByUser
    //http://localhost:3000/articles/user/17
    @Get("user/:id")
    findArticlesWrittenByUser(@Param("id") id: number) {
        return this.articlesService.findArticlesWrittenByUser(id);

    }


    @Patch(":id")
    updateArticle(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
        return this.articlesService.update(id, updateArticleDto);
    }


    @Patch(":id/photo")
    @UseInterceptors(AnyFilesInterceptor())
    updatePhoto(
        @Param("id") id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        console.log(id);
        return this.articlesService.updatePhoto(+id, files);
    }


}
