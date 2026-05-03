import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turma } from '../domain/turma.entity';
import { TurmaRepository } from '../domain/turma.repository';
import { TurmaOrmEntity } from './turma.orm-entity';

@Injectable()
export class TurmaTypeOrmRepository implements TurmaRepository {
    constructor(
        @InjectRepository(TurmaOrmEntity)
        private readonly repository: Repository<TurmaOrmEntity>,
    ) { }

    async findAll(): Promise<Turma[]> {
        const rows = await this.repository.find({ order: { ano: 'DESC', semestre: 'DESC', codigo: 'ASC' } });
        return rows.map(this.toDomain);
    }

    async findById(id: string): Promise<Turma | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? this.toDomain(row) : null;
    }

    async findByCodigo(codigo: string): Promise<Turma | null> {
        const row = await this.repository.findOne({ where: { codigo } });
        return row ? this.toDomain(row) : null;
    }

    async findByDisciplinaId(idDisciplina: string): Promise<Turma[]> {
        const rows = await this.repository.find({ where: { idDisciplina } });
        return rows.map(this.toDomain);
    }

    async findByProfessorId(idProfessor: string): Promise<Turma[]> {
        const rows = await this.repository.find({ where: { idProfessor } });
        return rows.map(this.toDomain);
    }

    async findByDisciplinaAndProfessor(idDisciplina: string, idProfessor: string): Promise<Turma | null> {
        const row = await this.repository.findOne({ where: { idDisciplina, idProfessor } });
        return row ? this.toDomain(row) : null;
    }

    async save(turma: Turma): Promise<Turma> {
        const saved = await this.repository.save(this.toOrm(turma));
        return this.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    private toDomain(row: TurmaOrmEntity): Turma {
        return new Turma(
            row.id,
            row.codigo.trim(),
            row.idDisciplina,
            row.idProfessor,
            row.ano,
            row.semestre,
        );
    }

    private toOrm(turma: Turma): TurmaOrmEntity {
        const row = new TurmaOrmEntity();
        if (turma.id) row.id = turma.id;
        row.codigo = turma.codigo;
        row.idDisciplina = turma.idDisciplina;
        row.idProfessor = turma.idProfessor;
        row.ano = turma.ano;
        row.semestre = turma.semestre;
        return row;
    }
}
