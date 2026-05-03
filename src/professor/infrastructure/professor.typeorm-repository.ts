import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor } from '../domain/professor.entity';
import { ProfessorRepository } from '../domain/professor.repository';
import { ProfessorOrmEntity } from './professor.orm-entity';

@Injectable()
export class ProfessorTypeOrmRepository implements ProfessorRepository {
    constructor(
        @InjectRepository(ProfessorOrmEntity)
        private readonly repository: Repository<ProfessorOrmEntity>,
    ) { }

    async findAll(): Promise<Professor[]> {
        const rows = await this.repository.find({ order: { nome: 'ASC' } });
        return rows.map(this.toDomain);
    }

    async findById(id: string): Promise<Professor | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? this.toDomain(row) : null;
    }

    async findByMatricula(matricula: number): Promise<Professor | null> {
        const row = await this.repository.findOne({ where: { matricula } });
        return row ? this.toDomain(row) : null;
    }

    async save(professor: Professor): Promise<Professor> {
        const saved = await this.repository.save(this.toOrm(professor));
        return this.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    private toDomain(row: ProfessorOrmEntity): Professor {
        return new Professor(row.id, row.matricula, row.nome);
    }

    private toOrm(professor: Professor): ProfessorOrmEntity {
        const row = new ProfessorOrmEntity();
        if (professor.id) row.id = professor.id;
        row.matricula = professor.matricula;
        row.nome = professor.nome;
        return row;
    }
}
