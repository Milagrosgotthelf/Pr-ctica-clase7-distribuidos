import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { NotasController } from './notas.controller.js';
import { NotasService } from './notas.service.js';
@Module({
    imports: [DatabaseModule],
    controllers: [NotasController],
    providers: [NotasService],
})
export class NotasModule { }