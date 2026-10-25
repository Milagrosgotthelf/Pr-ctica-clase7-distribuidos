import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateNotaDto } from './create-nota.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotaDto extends PartialType(CreateNotaDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    notificada?: boolean;
}
