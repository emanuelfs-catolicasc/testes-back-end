import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateProfessorDto {
    @IsInt()
    @Min(1)
    matricula!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    nome!: string;
}
