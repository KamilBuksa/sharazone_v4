import { IsString } from 'class-validator';

export class CreateArticleEvent {
  constructor(
    public readonly title: string,
    public readonly lead: string,
    public readonly body: string,
    public readonly articleId?:number
  ) {


  }
}