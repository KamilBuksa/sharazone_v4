import {IsString} from "class-validator";

export class CreateArticleDto {

    @IsString()
    readonly title: string;

    @IsString()
    readonly lead: string;

    @IsString()
    readonly body: string;

}
