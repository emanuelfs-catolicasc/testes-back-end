import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno } from '../domain/aluno.entity';
import { AlunoRepository } from '../domain/aluno.repository';
import { AlunoOrmEntity } from './aluno.orm-entity';

@Injectable()
export class AlunoTypeOrmRepository implements AlunoRepository {
    constructor(
        @InjectRepository(AlunoOrmEntity)
        private readonly repository: Repository<AlunoOrmEntity>,
    ) { }

    async findAll(): Promise<Aluno[]> {
        const rows = await this.repository.find({ order: { nome: 'ASC' } });
        return rows.map(this.toDomain);
    }

    async findById(id: string): Promise<Aluno | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? this.toDomain(row) : null;
    }

    async findByMatricula(matricula: number): Promise<Aluno | null> {
        const row = await this.repository.findOne({ where: { matricula } });
        return row ? this.toDomain(row) : null;
    }

    async save(aluno: Aluno): Promise<Aluno> {
        const saved = await this.repository.save(this.toOrm(aluno));
        return this.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    private toDomain(row: AlunoOrmEntity): Aluno {
        return new Aluno(row.id, row.matricula, row.nome);
    }

    private toOrm(aluno: Aluno): AlunoOrmEntity {
        const row = new AlunoOrmEntity();
        if (aluno.id) row.id = aluno.id;
        row.matricula = aluno.matricula;
        row.nome = aluno.nome;
        return row;
    }
}
