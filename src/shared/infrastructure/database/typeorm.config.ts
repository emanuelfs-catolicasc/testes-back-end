import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfigFactory = (
    config: ConfigService,
): TypeOrmModuleOptions => ({
    type: 'postgres',

    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', 5432),

    username: config.get<string>('DB_USERNAME', 'postgres'),
    password: config.get<string>('DB_PASSWORD', 'postgres'),
    database: config.get<string>('DB_DATABASE', 'academico'),

    autoLoadEntities: true,

    synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
    logging: config.get<boolean>('DB_LOGGING', false),
});
