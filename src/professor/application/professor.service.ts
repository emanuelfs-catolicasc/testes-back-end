import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Professor } from '../domain/professor.entity';
import { PROFESSOR_REPOSITORY } from '../domain/professor.repository';
import type { ProfessorRepository } from '../domain/professor.repository';

@Injectable()
export class ProfessorService {
    constructor(
        @Inject(PROFESSOR_REPOSITORY)
        private readonly professorRepository: ProfessorRepository,
    ) { }

    findAll(): Promise<Professor[]> {
        return this.professorRepository.findAll();
    }

    async findById(id: string): Promise<Professor> {
        const professor = await this.professorRepository.findById(id);
        if (!professor) throw new NotFoundException('Professor não encontrado.');
        return professor;
    }

    async create(input: { matricula: number; nome: string }): Promise<Professor> {
        const existing = await this.professorRepository.findByMatricula(input.matricula);
        if (existing) throw new ConflictException('Já existe professor com essa matrícula.');

        return this.professorRepository.save(Professor.create(input));
    }

    async update(id: string, input: { matricula?: number; nome?: string }): Promise<Professor> {
        const professor = await this.findById(id);

        if (input.matricula && input.matricula !== professor.matricula) {
            const existing = await this.professorRepository.findByMatricula(input.matricula);
            if (existing) throw new ConflictException('Já existe professor com essa matrícula.');
        }

        return this.professorRepository.save(professor.update(input));
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.professorRepository.delete(id);
    }
}
