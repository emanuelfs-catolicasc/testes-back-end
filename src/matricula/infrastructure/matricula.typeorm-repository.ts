import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matricula } from '../domain/matricula.entity';
import { MatriculaRepository } from '../domain/matricula.repository';
import { MatriculaStatus } from '../domain/matricula-status.enum';
import { MatriculaOrmEntity } from './matricula.orm-entity';

@Injectable()
export class MatriculaTypeOrmRepository implements MatriculaRepository {
    constructor(
        @InjectRepository(MatriculaOrmEntity)
        private readonly repository: Repository<MatriculaOrmEntity>,
    ) { }

    async findAll(): Promise<Matricula[]> {
        const rows = await this.repository.find();
        return rows.map(this.toDomain);
    }

    async findById(id: string): Promise<Matricula | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? this.toDomain(row) : null;
    }

    async findByAlunoId(idAluno: string): Promise<Matricula[]> {
        const rows = await this.repository.find({ where: { idAluno } });
        return rows.map(this.toDomain);
    }

    async findByTurmaId(idTurma: string): Promise<Matricula[]> {
        const rows = await this.repository.find({ where: { idTurma } });
        return rows.map(this.toDomain);
    }

    async findByAlunoAndTurma(idAluno: string, idTurma: string): Promise<Matricula | null> {
        const row = await this.repository.findOne({ where: { idAluno, idTurma } });
        return row ? this.toDomain(row) : null;
    }

    async save(matricula: Matricula): Promise<Matricula> {
        const saved = await this.repository.save(this.toOrm(matricula));
        return this.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    private toDomain(row: MatriculaOrmEntity): Matricula {
        return new Matricula(
            row.id,
            row.idAluno,
            row.idTurma,
            row.nota1,
            row.nota2,
            row.nota3,
            row.media,
            row.status as MatriculaStatus,
        );
    }

    private toOrm(matricula: Matricula): MatriculaOrmEntity {
        const row = new MatriculaOrmEntity();
        if (matricula.id) row.id = matricula.id;
        row.idAluno = matricula.idAluno;
        row.idTurma = matricula.idTurma;
        row.nota1 = matricula.nota1;
        row.nota2 = matricula.nota2;
        row.nota3 = matricula.nota3;
        row.media = matricula.media;
        row.status = matricula.status;
        return row;
    }
}
