import {Injectable, NotFoundException} from '@nestjs/common';
import {Article} from "./entities/article.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateArticleDto} from "./dto/create-article.dto";
import {UpdateArticleDto} from "./dto/update-article.dto";
@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>
    ) {
    }

    findAll() {
        return this.articleRepository.find();
    }

    async findOne(id: string) {
        const article = await this.articleRepository.findOne(id);

        if (!article) {
            throw new NotFoundException(`Article #${id} not found`)
        }

        return article
    }

    create(createArticleDto: CreateArticleDto) {
        const article = this.articleRepository.create(createArticleDto);
        return this.articleRepository.save(article)
    }

    async update(id: string, updateArticleDto: UpdateArticleDto) {
        console.log('update')
        const article = await this.articleRepository.preload({
            id: +id,
            ...updateArticleDto,
        });
        console.log(article)
        if (!article) {
            throw new NotFoundException(`Article #${id} not found`)
        }

        return this.articleRepository.save(article)
    }

    async remove(id: string) {
        const article = await this.articleRepository.findOne(id);
        console.log(article)
        return this.articleRepository.remove(article);
    }
}

