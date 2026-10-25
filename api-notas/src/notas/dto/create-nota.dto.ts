import { ApiProperty } from '@nestjs/swagger';

import { IsString, isInt, IsHexColor, IsPositive, MinLength, isHexColor, IsInt } from 'class-validator';

export class CreateNotaDto {
    @ApiProperty({ example: 'Entrega distribuidos' })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({ example: 'Convertir toda la logica de backend de la app de notas en un backend propiamente dicho' })
    @IsString()
    contenido: string;

    @ApiProperty({ example: '#fef08a' })
    @IsHexColor()
    color: string;

    @ApiProperty({ example: 120 })
    @IsInt()
    @IsPositive()
    minutosdevalidez: number;
}