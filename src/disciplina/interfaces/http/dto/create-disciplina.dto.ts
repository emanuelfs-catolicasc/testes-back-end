import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDisciplinaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    codigo!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    nome!: string;
}
