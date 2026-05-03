import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateProfessorDto {
    @ApiProperty({
        example: 1001,
        description: 'Matrícula única do professor.',
    })
    @IsInt()
    @Min(1)
    matricula!: number;

    @ApiProperty({
        example: 'João da Silva',
        description: 'Nome completo do professor.',
        maxLength: 200,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    nome!: string;
}
