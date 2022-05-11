import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/createplaylist.dto';
import { PlaylistService } from './playlist.service';

@Controller('playlist')
export class PlaylistController {
    constructor(private readonly playListService: PlaylistService){}

    @Get()
    createPlaylist(@Body() body:CreatePlaylistDto){
        return this.playListService.createOne(body)
    }

}
