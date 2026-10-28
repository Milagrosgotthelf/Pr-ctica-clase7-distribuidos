import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { NotasService } from './notas.service.js';
import { CreateNotaDto } from './dto/create-nota.dto.js';
import { UpdateNotaDto } from './dto/update-nota.dto.js';
const NOTA_EJEMPLO = {
    id: '428a4eec-8a63-4b72-a909-e13789a57c43',
    title: 'Práctica distribuidos',
    contenido: 'Contenido nota',
    color: '#fef08a',
    minutosdevalidez: 120,
    creadoEn: '2026-10-25T18:49:26.575Z',
    notificada: false,
};
@ApiTags('Notas')
@Controller('notas')


export class NotasController {
    constructor(private readonly notasService: NotasService) { }

    @Post()
    @ApiOperation({ summary: 'Crear nota', description: 'Crea una nueva nota adhesiva con validez en minutos.' })
    @ApiCreatedResponse({ description: 'Nota creada con éxito', schema: { example: NOTA_EJEMPLO } })
    @ApiBadRequestResponse({ description: 'Datos de entrada inválidos (ej. color incorrecto o campos vacíos)' })
    create(@Body() dto: CreateNotaDto) {
        return this.notasService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar notas', description: 'Devuelve todas las notas ordenadas por fecha.' })
    @ApiOkResponse({ description: 'Lista de notas', schema: { example: [NOTA_EJEMPLO] } })
    findAll() {
        return this.notasService.findAll();
    }
    //difícil ya que el UUID es un número muy largo
    @Get(':id')
    @ApiOperation({ summary: 'Obtener nota por ID' })
    @ApiParam({ name: 'id', description: 'UUID de la nota', format: 'uuid' })
    @ApiOkResponse({ description: 'Nota encontrada', schema: { example: NOTA_EJEMPLO } })
    @ApiNotFoundResponse({ description: 'Nota no encontrada' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.notasService.findOne(id);
    }

    @Put(':id')
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar nota',
        description: 'Permite editar título, contenido, color, validez o actualizar el flag de notificada.',
    })
    @ApiParam({ name: 'id', description: 'UUID de la nota', format: 'uuid' })
    @ApiOkResponse({ description: 'Nota actualizada', schema: { example: NOTA_EJEMPLO } })
    @ApiNotFoundResponse({ description: 'Nota no encontrada' })
    @ApiBadRequestResponse({ description: 'Campos no permitidos o tipos de datos inválidos' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNotaDto) {
        return this.notasService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar nota por ID' })
    @ApiParam({ name: 'id', description: 'UUID de la nota', format: 'uuid' })
    @ApiOkResponse({
        description: 'Nota eliminada',
        schema: { example: { mensaje: 'Nota eliminada con éxito', id: '428a4eec-8a63-4b72-a909-e13789a57c43' } },
    })
    @ApiNotFoundResponse({ description: 'Nota no encontrada' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.notasService.remove(id);
    }
}