export class Aluno {
    constructor(
        public readonly id: string | null,
        public readonly matricula: number,
        public readonly nome: string,
    ) { }

    static create(input: { matricula: number; nome: string }): Aluno {
        return new Aluno(null, input.matricula, input.nome);
    }

    update(input: { matricula?: number; nome?: string }): Aluno {
        return new Aluno(
            this.id,
            input.matricula ?? this.matricula,
            input.nome ?? this.nome,
        );
    }
}
