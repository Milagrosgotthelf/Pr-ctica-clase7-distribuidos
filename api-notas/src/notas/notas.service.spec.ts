import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFile, JsonDb } from '../database/json-db.js';
import { NotasService } from './notas.service.js';
import { Nota } from './entities/nota.entity.js';

describe('NotasService', () => {
    let service: NotasService;
    let fakeDb: DatabaseFile;
    let mockJsonDb: {
        read: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        fakeDb = { notas: [] };
        // Defino los métodos mock de JsonDb
        mockJsonDb = {
            read: vi.fn(async () => fakeDb),
            update: vi.fn(async (change: (db: DatabaseFile) => any) => {
                return change(fakeDb);
            }),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotasService,
                {
                    provide: JsonDb,
                    useValue: mockJsonDb, // Inyecto el mock de JsonDb
                },
            ],
        }).compile();

        service = module.get(NotasService);
    });

    it('crea una nota con los valores iniciales correctos', async () => {
        const nota = await service.create({
            title: 'Test',
            contenido: 'Contenido',
            color: '#ffffff',
            minutosdevalidez: 10,
        });

        expect(mockJsonDb.update).toHaveBeenCalledTimes(1);
        expect(nota.id).toEqual(expect.any(String));
        expect(nota.title).toBe('Test');
        expect(nota.contenido).toBe('Contenido');
        expect(nota.color).toBe('#ffffff');
        expect(nota.minutosdevalidez).toBe(10);
        expect(nota.notificada).toBe(false);
        expect(nota.creadoEn).toBeDefined();

        expect(fakeDb.notas).toHaveLength(1);
        expect(fakeDb.notas[0]).toEqual(nota);
    });

    it('devuelve una lista vacía cuando no hay notas', async () => {
        const notas = await service.findAll();
        expect(mockJsonDb.read).toHaveBeenCalledTimes(1);
        expect(notas).toEqual([]);
    });

    it('devuelve las notas ordenadas de la más reciente a la más antigua', async () => {
        fakeDb.notas = [
            {
                id: '1',
                title: 'Nota 1',
                contenido: 'Contenido 1',
                color: '#fef08a',
                minutosdevalidez: 5,
                creadoEn: '2026-10-25T10:00:00.000Z',
                notificada: false,
            },
            {
                id: '2',
                title: 'Nota 2 (más reciente)',
                contenido: 'Contenido 2',
                color: '#bbf7d0',
                minutosdevalidez: 15,
                creadoEn: '2026-10-25T12:00:00.000Z',
                notificada: false,
            },
        ];

        const notas = await service.findAll();
        expect(mockJsonDb.read).toHaveBeenCalledTimes(1);
        expect(notas.length).toBe(2);
        expect(notas[0].id).toBe('2');
        expect(notas[1].id).toBe('1');
    });

    it('encuentra una nota existente por su id', async () => {
        const notaGuardada: Nota = {
            id: 'uuid-123',
            title: 'Buscar',
            contenido: 'Contenido a buscar',
            color: '#bfdbfe',
            minutosdevalidez: 20,
            creadoEn: '2026-10-25T12:00:00.000Z',
            notificada: false,
        };
        fakeDb.notas = [notaGuardada];

        const encontrada = await service.findOne('uuid-123');
        expect(mockJsonDb.read).toHaveBeenCalledTimes(1);
        expect(encontrada).toEqual(notaGuardada);
    });

    it('lanza NotFoundException al buscar una nota inexistente', async () => {
        fakeDb.notas = [];
        await expect(service.findOne('uuid-inexistente')).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    it('actualiza el contenido de una nota y resetea notificada a false', async () => {
        fakeDb.notas = [
            {
                id: 'uuid-123',
                title: 'Original',
                contenido: 'Texto original',
                color: '#fef08a',
                minutosdevalidez: 10,
                creadoEn: '2026-10-25T10:00:00.000Z',
                notificada: true,
            },
        ];

        const actualizada = await service.update('uuid-123', {
            title: 'Modificado',
        });

        expect(mockJsonDb.update).toHaveBeenCalledTimes(1);
        expect(actualizada.title).toBe('Modificado');
        expect(actualizada.contenido).toBe('Texto original');
        expect(actualizada.notificada).toBe(false);
    });

    it('lanza NotFoundException al intentar actualizar una nota inexistente', async () => {
        fakeDb.notas = [];
        await expect(
            service.update('uuid-falso', { title: 'Nuevo' }),
        ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('elimina una nota existente correctamente', async () => {
        fakeDb.notas = [
            {
                id: 'uuid-123',
                title: 'Para borrar',
                contenido: 'Se va a eliminar',
                color: '#fed7aa',
                minutosdevalidez: 5,
                creadoEn: '2026-10-25T10:00:00.000Z',
                notificada: false,
            },
        ];

        const resultado = await service.remove('uuid-123');
        expect(mockJsonDb.update).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual({
            mensaje: 'Nota eliminada',
            id: 'uuid-123',
        });
        expect(fakeDb.notas).toHaveLength(0);
    });

    it('lanza NotFoundException al intentar eliminar una nota inexistente', async () => {
        fakeDb.notas = [];
        await expect(service.remove('uuid-falso')).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });
});