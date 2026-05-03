export class Disciplina {
    constructor(
        public readonly id: string | null,
        public readonly codigo: string,
        public readonly nome: string,
    ) { }

    static create(input: { codigo: string; nome: string }): Disciplina {
        return new Disciplina(null, input.codigo, input.nome);
    }

    update(input: { codigo?: string; nome?: string }): Disciplina {
        return new Disciplina(
            this.id,
            input.codigo ?? this.codigo,
            input.nome ?? this.nome,
        );
    }
}
