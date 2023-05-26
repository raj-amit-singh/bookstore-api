import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationQuery {

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    query: string;

    @ApiProperty({
        minimum: 0,
        maximum: 10000,
        title: 'Page',
        exclusiveMaximum: true,
        exclusiveMinimum: true,
        format: 'int32',
        default: 1
    })
    page: number;

    @ApiProperty({
        maximum: 1000,
        default: 10
    })
    limit: number;

}