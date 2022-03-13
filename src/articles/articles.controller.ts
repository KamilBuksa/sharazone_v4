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
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ApiKeyGuard } from "../common/guards/api-key.guard";
import { Request, Response } from "express";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { MessagePattern } from "@nestjs/microservices";

@Controller("articles")
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService
  ) {
  }


  //Guard jest po to by mieć dostęp do req.user i z rozkodowanego tokenu wziąć id, by je przypisać do tabeli article wraz z artykułem
  // create article with photo
  @UseGuards(ApiKeyGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createArticleAndSendPhoto(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: Request
  ) {
    return this.articlesService.createArticleAndSendPhoto(createArticleDto, files, req);
  }

  // Post photo and save photoId in article
  @UseGuards(ApiKeyGuard)
  @Post(":id/photo")
  @UseInterceptors(AnyFilesInterceptor())
  async sendPhoto(
      @Param('id', ParseIntPipe) articleId:number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.articlesService.sendPhoto(files,articleId);
  }

  @MessagePattern({cmd:'add_photoId'})
  async addPhotoId(
      @Body() body
  ){
    return this.articlesService.addPhotoId(body)
  }


//delete article and photo
  @Delete(":id")
  deleteArticleAndPhoto(@Param("id") id) {
    return this.articlesService.remove(id);
  }

//  -----------------------------
  @Get("photo/:id")
  downloadPhotoFromArticle(@Param("id") id, @Req() req: Request) {
    console.log(id);
    return this.articlesService.downloadPhotoFromArticle(id);
  }

// get full photo path
  @MessagePattern({ cmd: "download_photo2" })
  async downloadPhotoMessage(@Body() body, @Res() res: Response) {
    return this.articlesService.downloadPhotoMessage(body);
  }

  // ----------------------------

  @Get()
  findAllArticles(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    console.log('asdasd');
    return this.articlesService.findAll();
  }

  @Get(":id")
  findOneArticle(@Param("id") id: number) /* Param domyślnie jest stringiem, transform:true w Pipe umożliwia otypowanie go na number */ {
    return this.articlesService.findOne("" + id);
  }

  //if you dont want auth table to be see, just delete relations: ['auth'] in findArticlesWrittenByUser
  @Get("user/:id")
  findArticlesWrittenByUser(@Param("id") id: number) {
    return this.articlesService.findArticlesWrittenByUser(id);

  }


  @Patch(":id")
  updateArticle(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }


  @Patch("photo/:id")
  @UseInterceptors(AnyFilesInterceptor())
  updatePhoto(
    @Param("id") id: string,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    console.log(id);
    return this.articlesService.updatePhoto(+id, files);
  }


}
