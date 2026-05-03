import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DisciplinaService } from '../../disciplina/application/disciplina.service';
import { ProfessorService } from '../../professor/application/professor.service';
import { Turma } from '../domain/turma.entity';
import { TURMA_REPOSITORY } from '../domain/turma.repository';
import type { TurmaRepository } from '../domain/turma.repository';

@Injectable()
export class TurmaService {
    constructor(
        @Inject(TURMA_REPOSITORY)
        private readonly turmaRepository: TurmaRepository,
        private readonly disciplinaService: DisciplinaService,
        private readonly professorService: ProfessorService,
    ) { }

    findAll(): Promise<Turma[]> {
        return this.turmaRepository.findAll();
    }

    async findById(id: string): Promise<Turma> {
        const turma = await this.turmaRepository.findById(id);
        if (!turma) throw new NotFoundException('Turma não encontrada.');
        return turma;
    }

    findByDisciplinaId(idDisciplina: string): Promise<Turma[]> {
        return this.turmaRepository.findByDisciplinaId(idDisciplina);
    }

    findByProfessorId(idProfessor: string): Promise<Turma[]> {
        return this.turmaRepository.findByProfessorId(idProfessor);
    }

    async create(input: {
        codigo: string;
        idDisciplina: string;
        idProfessor: string;
        ano: number;
        semestre: number;
    }): Promise<Turma> {
        await this.validateReferences(input.idDisciplina, input.idProfessor);
        await this.validateUniqueConstraints(input.codigo, input.idDisciplina, input.idProfessor);

        try {
            return await this.turmaRepository.save(Turma.create(input));
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'Erro ao criar turma.');
        }
    }

    async update(id: string, input: {
        codigo?: string;
        idDisciplina?: string;
        idProfessor?: string;
        ano?: number;
        semestre?: number;
    }): Promise<Turma> {
        const turma = await this.findById(id);

        const nextIdDisciplina = input.idDisciplina ?? turma.idDisciplina;
        const nextIdProfessor = input.idProfessor ?? turma.idProfessor;

        await this.validateReferences(nextIdDisciplina, nextIdProfessor);

        if (input.codigo && input.codigo !== turma.codigo) {
            const existingCodigo = await this.turmaRepository.findByCodigo(input.codigo);
            if (existingCodigo) throw new ConflictException('Já existe turma com esse código.');
        }

        const changedPair = nextIdDisciplina !== turma.idDisciplina || nextIdProfessor !== turma.idProfessor;
        if (changedPair) {
            const existingPair = await this.turmaRepository.findByDisciplinaAndProfessor(nextIdDisciplina, nextIdProfessor);
            if (existingPair) throw new ConflictException('Já existe turma para essa disciplina e professor.');
        }

        try {
            return await this.turmaRepository.save(turma.update(input));
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'Erro ao atualizar turma.');
        }
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.turmaRepository.delete(id);
    }

    private async validateReferences(idDisciplina: string, idProfessor: string): Promise<void> {
        await this.disciplinaService.findById(idDisciplina);
        await this.professorService.findById(idProfessor);
    }

    private async validateUniqueConstraints(codigo: string, idDisciplina: string, idProfessor: string): Promise<void> {
        const existingCodigo = await this.turmaRepository.findByCodigo(codigo);
        if (existingCodigo) throw new ConflictException('Já existe turma com esse código.');

        const existingPair = await this.turmaRepository.findByDisciplinaAndProfessor(idDisciplina, idProfessor);
        if (existingPair) throw new ConflictException('Já existe turma para essa disciplina e professor.');
    }
}
