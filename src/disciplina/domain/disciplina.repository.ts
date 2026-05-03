import { Disciplina } from './disciplina.entity';

export const DISCIPLINA_REPOSITORY = Symbol('DISCIPLINA_REPOSITORY');

export interface DisciplinaRepository {
    findAll(): Promise<Disciplina[]>;
    findById(id: string): Promise<Disciplina | null>;
    findByCodigo(codigo: string): Promise<Disciplina | null>;
    save(disciplina: Disciplina): Promise<Disciplina>;
    delete(id: string): Promise<void>;
}
