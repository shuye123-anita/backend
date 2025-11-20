import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('vehicles/:vehicleId/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  create(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.createForVehicle(vehicleId, dto);
  }

  @Get()
  findAll(@Param('vehicleId') vehicleId: string) {
    return this.availabilityService.findByVehicleId(vehicleId);
  }
}
