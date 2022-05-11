import { PartialType } from "@nestjs/mapped-types";
import { CreatePlaylistDto } from "./createplaylist.dto";

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto){}