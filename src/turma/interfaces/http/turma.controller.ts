import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { MatriculaService } from '../../../matricula/application/matricula.service';
import { TurmaService } from '../../application/turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Controller('turmas')
export class TurmaController {
    constructor(
        private readonly turmaService: TurmaService,
        private readonly matriculaService: MatriculaService,
    ) { }

    @Get()
    findAll() {
        return this.turmaService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.turmaService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateTurmaDto) {
        return this.turmaService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTurmaDto) {
        return this.turmaService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.turmaService.delete(id);
    }

    @Get(':id/alunos')
    findAlunos(@Param('id', ParseUUIDPipe) id: string) {
        return this.matriculaService.findByTurmaId(id);
    }
}
