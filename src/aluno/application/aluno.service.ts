import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Aluno } from '../domain/aluno.entity';
import { ALUNO_REPOSITORY } from '../domain/aluno.repository';
import type { AlunoRepository } from '../domain/aluno.repository';

@Injectable()
export class AlunoService {
    constructor(
        @Inject(ALUNO_REPOSITORY)
        private readonly alunoRepository: AlunoRepository,
    ) { }

    findAll(): Promise<Aluno[]> {
        return this.alunoRepository.findAll();
    }

    async findById(id: string): Promise<Aluno> {
        const aluno = await this.alunoRepository.findById(id);
        if (!aluno) throw new NotFoundException('Aluno não encontrado.');
        return aluno;
    }

    async create(input: { matricula: number; nome: string }): Promise<Aluno> {
        const existing = await this.alunoRepository.findByMatricula(input.matricula);
        if (existing) throw new ConflictException('Já existe aluno com essa matrícula.');

        return this.alunoRepository.save(Aluno.create(input));
    }

    async update(id: string, input: { matricula?: number; nome?: string }): Promise<Aluno> {
        const aluno = await this.findById(id);

        if (input.matricula && input.matricula !== aluno.matricula) {
            const existing = await this.alunoRepository.findByMatricula(input.matricula);
            if (existing) throw new ConflictException('Já existe aluno com essa matrícula.');
        }

        return this.alunoRepository.save(aluno.update(input));
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.alunoRepository.delete(id);
    }
}
