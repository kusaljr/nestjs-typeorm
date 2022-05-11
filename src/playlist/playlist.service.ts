import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePlaylistDto } from "./dto/createplaylist.dto";
import { UpdatePlaylistDto } from "./dto/updateplaylist.dto";
import { Playlist, PlaylistDocument } from "./entities/playlist.entity";
import { RemovePlaylistData } from "./playlist.interface";

@Injectable()
export class PlaylistService {
  public constructor(
    @InjectModel(Playlist.name)
    private  playlistRepository: Model<PlaylistDocument>,
  ) {}

  public async findOneByIdOrThrow(id: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      id,
    });

    if (!playlist) {
      throw new NotFoundException('No playlist found.');
    }

    return playlist;
  }

  public async createOne(
    createPlaylistData: CreatePlaylistDto,
  ): Promise<Playlist> {
    const { title, description } = createPlaylistData;
    if (title == "") {
        throw new BadRequestException('Title is required! It cannot be empty!');
    }
    

    const createdPlaylist = new this.playlistRepository(createPlaylistData);

    return createdPlaylist.save();
  }


  public async removeOne(
    removePlaylistData: RemovePlaylistData,
  ): Promise<void> {
    const { id } = removePlaylistData;

    const playlist = await this.findOneByIdOrThrow(id);

    await this.playlistRepository.deleteOne({_id: id}).exec();

    return null;
  }

  public async updateOne(
    updatePlaylistData: UpdatePlaylistDto,
    id: string
  ): Promise<Playlist> {
    

    const existingPlaylist = await this.findOneByIdOrThrow(id);

    return this.playlistRepository.findByIdAndUpdate(
        {_id: id},
        {$set: updatePlaylistData},
        {new: true}
    )
  }
}