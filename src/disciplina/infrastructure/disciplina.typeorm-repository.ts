import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disciplina } from '../domain/disciplina.entity';
import { DisciplinaRepository } from '../domain/disciplina.repository';
import { DisciplinaOrmEntity } from './disciplina.orm-entity';

@Injectable()
export class DisciplinaTypeOrmRepository implements DisciplinaRepository {
    constructor(
        @InjectRepository(DisciplinaOrmEntity)
        private readonly repository: Repository<DisciplinaOrmEntity>,
    ) { }

    async findAll(): Promise<Disciplina[]> {
        const rows = await this.repository.find({ order: { nome: 'ASC' } });
        return rows.map(this.toDomain);
    }

    async findById(id: string): Promise<Disciplina | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? this.toDomain(row) : null;
    }

    async findByCodigo(codigo: string): Promise<Disciplina | null> {
        const row = await this.repository.findOne({ where: { codigo } });
        return row ? this.toDomain(row) : null;
    }

    async save(disciplina: Disciplina): Promise<Disciplina> {
        const saved = await this.repository.save(this.toOrm(disciplina));
        return this.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    private toDomain(row: DisciplinaOrmEntity): Disciplina {
        return new Disciplina(row.id, row.codigo.trim(), row.nome);
    }

    private toOrm(disciplina: Disciplina): DisciplinaOrmEntity {
        const row = new DisciplinaOrmEntity();
        if (disciplina.id) row.id = disciplina.id;
        row.codigo = disciplina.codigo;
        row.nome = disciplina.nome;
        return row;
    }
}
