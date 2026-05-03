import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Disciplina } from '../domain/disciplina.entity';
import { DISCIPLINA_REPOSITORY } from '../domain/disciplina.repository';
import type { DisciplinaRepository } from '../domain/disciplina.repository';

@Injectable()
export class DisciplinaService {
    constructor(
        @Inject(DISCIPLINA_REPOSITORY)
        private readonly disciplinaRepository: DisciplinaRepository,
    ) { }

    findAll(): Promise<Disciplina[]> {
        return this.disciplinaRepository.findAll();
    }

    async findById(id: string): Promise<Disciplina> {
        const disciplina = await this.disciplinaRepository.findById(id);
        if (!disciplina) throw new NotFoundException('Disciplina não encontrada.');
        return disciplina;
    }

    async create(input: { codigo: string; nome: string }): Promise<Disciplina> {
        const existing = await this.disciplinaRepository.findByCodigo(input.codigo);
        if (existing) throw new ConflictException('Já existe disciplina com esse código.');

        return this.disciplinaRepository.save(Disciplina.create(input));
    }

    async update(id: string, input: { codigo?: string; nome?: string }): Promise<Disciplina> {
        const disciplina = await this.findById(id);

        if (input.codigo && input.codigo !== disciplina.codigo) {
            const existing = await this.disciplinaRepository.findByCodigo(input.codigo);
            if (existing) throw new ConflictException('Já existe disciplina com esse código.');
        }

        return this.disciplinaRepository.save(disciplina.update(input));
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.disciplinaRepository.delete(id);
    }
}
