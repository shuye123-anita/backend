import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  vin: string;

  @IsString()
  licensePlate: string;

  @IsNumber()
  basePricePerDay: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @IsOptional()
  @IsObject()
  features?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  ownershipDocsUrl?: string;
}
