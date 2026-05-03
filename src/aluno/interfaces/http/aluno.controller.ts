import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { AlunoService } from '../../application/aluno.service';
import { MatriculaService } from '../../../matricula/application/matricula.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Alunos')
@Controller('alunos')
export class AlunoController {
    constructor(
        private readonly alunoService: AlunoService,
        private readonly matriculaService: MatriculaService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Lista todos os alunos' })
    @ApiResponse({ status: 200, description: 'Lista de alunos retornada com sucesso.' })
    findAll() {
        return this.alunoService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um aluno pelo ID' })
    @ApiResponse({ status: 200, description: 'Aluno encontrado.' })
    @ApiResponse({ status: 404, description: 'Aluno não encontrado.' })
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.alunoService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateAlunoDto) {
        return this.alunoService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAlunoDto) {
        return this.alunoService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.alunoService.delete(id);
    }

    @Get(':id/turmas')
    findTurmas(@Param('id', ParseUUIDPipe) id: string) {
        return this.matriculaService.findByAlunoId(id);
    }
}
