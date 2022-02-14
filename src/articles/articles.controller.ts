import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    Query, UseGuards, Req,
} from '@nestjs/common';
import {ArticlesService} from "./articles.service";
import {CreateArticleDto} from "./dto/create-article.dto";
import {UpdateArticleDto} from "./dto/update-article.dto";
import { Auth } from '../auth/entities/auth.entity';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService,
                protected readonly jwtService: JwtService,
    ) {
    }

    @Get()
    findAllArticles(@Query() paginationQuery) {
        const {limit, offset} = paginationQuery;
        return this.articlesService.findAll()
    }

    @Get(':id')
    findOneArticle(@Param('id') id: number) /* Param domyślnie jest stringiem, transform:true w Pipe umożliwia otypowanie go na number */ {
        return this.articlesService.findOne("" + id)
    }
@UseGuards(ApiKeyGuard)
    @Post()
    async createArticle(@Body() createArticleDto: CreateArticleDto, @Req() req:Request) {
        console.log(createArticleDto instanceof CreateArticleDto)
    const result = await this.articlesService.create(createArticleDto,req)
        return result
    }


    @Patch(':id')
    updateArticle(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
        return this.articlesService.update(id, updateArticleDto)
    }

    @Delete(':id')
    deleteArticle(@Param('id') id) {
        return this.articlesService.remove(id)
    }

}
