import {PartialType} from "@nestjs/mapped-types";
import {CreateArticleDto} from "./create-article.dto";

export class UpdateArticleDto extends PartialType(CreateArticleDto){}

//PartialType dziedziczy  walidację, typy i opcjonalne właściwości po CreateArticleDto