import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { DisciplinaService } from '../../application/disciplina.service';
import { TurmaService } from '../../../turma/application/turma.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@Controller('disciplinas')
export class DisciplinaController {
    constructor(
        private readonly disciplinaService: DisciplinaService,
        private readonly turmaService: TurmaService,
    ) { }

    @Get()
    findAll() {
        return this.disciplinaService.findAll();
    }

    @Get(':id')
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
