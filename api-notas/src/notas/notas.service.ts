import { randomUUID } from 'node:crypto';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JsonDb } from '../database/json-db.js';
import { CreateNotaDto } from './dto/create-nota.dto.js';
import { UpdateNotaDto } from './dto/update-nota.dto.js';
import { Nota } from './entities/nota.entity.js';
@Injectable()
export class NotasService {
    constructor(private readonly db: JsonDb) { }


    create(dto: CreateNotaDto): Promise<Nota> {
        return this.db.update((data) => {
            if (!data.notas)
                data.notas = [];

            const nota: Nota = {
                id: randomUUID(),
                title: dto.title,
                contenido: dto.contenido,
                color: dto.color,
                minutosdevalidez: dto.minutosdevalidez,
                creadoEn: new Date().toISOString(),
                notificada: false,
            };
            data.notas.push(nota);
            return nota;
        })

    }

    async findAll(): Promise<Nota[]> {
        const data = await this.db.read();
        return [...(data.notas ?? [])].sort((a, b) => {
            const timeA = typeof a.creadoEn === 'string' ? new Date(a.creadoEn).getTime() : Number(a.creadoEn);
            const timeB = typeof b.creadoEn === 'string' ? new Date(b.creadoEn).getTime() : Number(b.creadoEn);
            return timeB - timeA;
        });
    }

    async findOne(id: string): Promise<Nota> {
        const data = await this.db.read();
        const nota = data.notas?.find((item) => item.id === id);
        if (!nota) throw new NotFoundException('Nota no encontrada');
        return nota;
    }

    update(id: string, dto: UpdateNotaDto): Promise<Nota> {
        return this.db.update((data) => {
            const nota = data.notas.find((item) => item.id === id);
            if (!nota) throw new NotFoundException('Nota no encontrada');
            // Si el frontend manda título o contenido, es una edición manual del usuario
            if (dto.title !== undefined || dto.contenido !== undefined) {
                if (dto.title !== undefined) nota.title = dto.title;
                if (dto.contenido !== undefined) nota.contenido = dto.contenido;
                if (dto.color !== undefined) nota.color = dto.color;
                if (dto.minutosdevalidez !== undefined) nota.minutosdevalidez = dto.minutosdevalidez;


                nota.creadoEn = new Date().toISOString();
                nota.notificada = false;
            } else if (dto.notificada !== undefined) {
                nota.notificada = dto.notificada;
            }
            return nota;
        });
    }

    remove(id: string): Promise<{ mensaje: string; id: string }> {
        return this.db.update((data) => {
            const index = data.notas?.findIndex((item) => item.id === id);
            if (index === -1) throw new NotFoundException('Nota no encontrada');
            data.notas.splice(index, 1);
            return { mensaje: 'Nota eliminada', id };
        });
    }
}