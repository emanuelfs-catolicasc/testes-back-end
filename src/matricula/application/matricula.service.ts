import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AlunoService } from '../../aluno/application/aluno.service';
import { TurmaService } from '../../turma/application/turma.service';
import { Matricula } from '../domain/matricula.entity';
import { MATRICULA_REPOSITORY } from '../domain/matricula.repository';
import type { MatriculaRepository } from '../domain/matricula.repository';
import { MatriculaStatus } from '../domain/matricula-status.enum';

@Injectable()
export class MatriculaService {
    constructor(
        @Inject(MATRICULA_REPOSITORY)
        private readonly matriculaRepository: MatriculaRepository,
        private readonly alunoService: AlunoService,
        private readonly turmaService: TurmaService,
    ) { }

    findAll(): Promise<Matricula[]> {
        return this.matriculaRepository.findAll();
    }

    async findById(id: string): Promise<Matricula> {
        const matricula = await this.matriculaRepository.findById(id);
        if (!matricula) throw new NotFoundException('Matrícula não encontrada.');
        return matricula;
    }

    findByAlunoId(idAluno: string): Promise<Matricula[]> {
        return this.matriculaRepository.findByAlunoId(idAluno);
    }

    findByTurmaId(idTurma: string): Promise<Matricula[]> {
        return this.matriculaRepository.findByTurmaId(idTurma);
    }

    async create(input: {
        idAluno: string;
        idTurma: string;
        nota1?: number | null;
        nota2?: number | null;
        nota3?: number | null;
        media?: number | null;
        status?: MatriculaStatus;
    }): Promise<Matricula> {
        await this.validateReferences(input.idAluno, input.idTurma);

        const existing = await this.matriculaRepository.findByAlunoAndTurma(input.idAluno, input.idTurma);
        if (existing) throw new ConflictException('Aluno já está matriculado nessa turma.');

        try {
            return await this.matriculaRepository.save(Matricula.create(input));
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'Erro ao criar matrícula.');
        }
    }

    async update(id: string, input: {
        idAluno?: string;
        idTurma?: string;
        nota1?: number | null;
        nota2?: number | null;
        nota3?: number | null;
        media?: number | null;
        status?: MatriculaStatus;
    }): Promise<Matricula> {
        const matricula = await this.findById(id);

        const nextIdAluno = input.idAluno ?? matricula.idAluno;
        const nextIdTurma = input.idTurma ?? matricula.idTurma;

        await this.validateReferences(nextIdAluno, nextIdTurma);

        const changedPair = nextIdAluno !== matricula.idAluno || nextIdTurma !== matricula.idTurma;
        if (changedPair) {
            const existing = await this.matriculaRepository.findByAlunoAndTurma(nextIdAluno, nextIdTurma);
            if (existing) throw new ConflictException('Aluno já está matriculado nessa turma.');
        }

        try {
            return await this.matriculaRepository.save(matricula.update(input));
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'Erro ao atualizar matrícula.');
        }
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.matriculaRepository.delete(id);
    }

    private async validateReferences(idAluno: string, idTurma: string): Promise<void> {
        await this.alunoService.findById(idAluno);
        await this.turmaService.findById(idTurma);
    }
}
