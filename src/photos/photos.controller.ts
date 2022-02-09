import {Body, Controller, Delete, Get, Param, Post, } from '@nestjs/common';
import {PhotosService} from "./photos.service";

@Controller('photos')
export class PhotosController {
    constructor(
        private readonly photosService:PhotosService
    ) {
    }


    @Post('files')
    uploadPhoto(){
        console.log('weszło')
    }

    @Get('download/:directoryIndex/:fileName')
    downloadPhoto(){
        console.log('weszło2')
    }

    @Delete('/delete/:directoryIndex')
    deletePhotoWithDirectory(){
        console.log('weszło3')
    }


}
