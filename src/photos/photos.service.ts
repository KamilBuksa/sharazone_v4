import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {Photo} from "./entities/photo.entity";
import {InjectRepository} from "@nestjs/typeorm";
import path from "path";

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository:Repository<Photo>
    ) {}

   async uploadFile(photo:string) {
   }

    async downloadFile  (req, res, next)  {

    }

}
