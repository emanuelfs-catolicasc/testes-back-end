import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { MatriculaService } from '../../application/matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Controller('matriculas')
export class MatriculaController {
    constructor(private readonly matriculaService: MatriculaService) { }

    @Get()
    findAll() {
        return this.matriculaService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.matriculaService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateMatriculaDto) {
        return this.matriculaService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMatriculaDto) {
        return this.matriculaService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.matriculaService.delete(id);
    }
}
