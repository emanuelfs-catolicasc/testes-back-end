import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ProfessorService } from '../../application/professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { TurmaService } from '../../../turma/application/turma.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Professores')
@Controller('professores')
export class ProfessorController {
    constructor(
        private readonly professorService: ProfessorService,
        private readonly turmaService: TurmaService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Lista todos os professores' })
    @ApiResponse({ status: 200, description: 'Lista de professores retornada com sucesso.' })
    findAll() {
        return this.professorService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um professor pelo ID' })
    @ApiResponse({ status: 200, description: 'Professor encontrado.' })
    @ApiResponse({ status: 404, description: 'Professor não encontrado.' })
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
