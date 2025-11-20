import { IsEnum } from 'class-validator';
import { VehicleStatus } from '../../vehicles/vehicle.entity';

export class UpdateVehicleStatusDto {
  @IsEnum(VehicleStatus)
  status: VehicleStatus;
}
