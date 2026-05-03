import { Turma } from './turma.entity';

export const TURMA_REPOSITORY = Symbol('TURMA_REPOSITORY');

export interface TurmaRepository {
    findAll(): Promise<Turma[]>;
    findById(id: string): Promise<Turma | null>;
    findByCodigo(codigo: string): Promise<Turma | null>;
    findByDisciplinaId(idDisciplina: string): Promise<Turma[]>;
    findByProfessorId(idProfessor: string): Promise<Turma[]>;
    findByDisciplinaAndProfessor(idDisciplina: string, idProfessor: string): Promise<Turma | null>;
    save(turma: Turma): Promise<Turma>;
    delete(id: string): Promise<void>;
}
