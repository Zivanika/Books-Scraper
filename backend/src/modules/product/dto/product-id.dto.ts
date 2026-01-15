import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductIdDto {
  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Product UUID',
    format: 'uuid'
  })
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id: string;
}
