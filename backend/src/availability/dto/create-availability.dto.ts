import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AvailabilityStatus } from '../availability.entity';

export class CreateAvailabilityDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsEnum(AvailabilityStatus)
  status?: AvailabilityStatus;
}
