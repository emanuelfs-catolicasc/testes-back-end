import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ProfessorService } from '../../application/professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { TurmaService } from '../../../turma/application/turma.service';

@Controller('professores')
export class ProfessorController {
    constructor(
        private readonly professorService: ProfessorService,
        private readonly turmaService: TurmaService,
    ) { }

    @Get()
    findAll() {
        return this.professorService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.professorService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateProfessorDto) {
        return this.professorService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProfessorDto) {
        return this.professorService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.professorService.delete(id);
    }

    @Get(':id/turmas')
    findTurmas(@Param('id', ParseUUIDPipe) id: string) {
        return this.turmaService.findByProfessorId(id);
    }
}
