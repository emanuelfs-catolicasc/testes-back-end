import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { DisciplinaService } from '../../application/disciplina.service';
import { TurmaService } from '../../../turma/application/turma.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Disciplinas')
@Controller('disciplinas')
export class DisciplinaController {
    constructor(
        private readonly disciplinaService: DisciplinaService,
        private readonly turmaService: TurmaService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Lista todos as disciplinas' })
    @ApiResponse({ status: 200, description: 'Lista de disciplinas retornada com sucesso.' })
    findAll() {
        return this.disciplinaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma disciplina pelo ID' })
    @ApiResponse({ status: 200, description: 'Disciplina encontrada.' })
    @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.disciplinaService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateDisciplinaDto) {
        return this.disciplinaService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDisciplinaDto) {
        return this.disciplinaService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.disciplinaService.delete(id);
    }

    @Get(':id/turmas')
    findTurmas(@Param('id', ParseUUIDPipe) id: string) {
        return this.turmaService.findByDisciplinaId(id);
    }
}
