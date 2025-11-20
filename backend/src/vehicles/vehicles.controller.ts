import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('partners/:partnerId/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(
    @Param('partnerId') partnerId: string,
    @Body() dto: CreateVehicleDto,
  ) {
    return this.vehiclesService.createForPartner(partnerId, dto);
  }

  @Get()
  findAll(@Param('partnerId') partnerId: string) {
    return this.vehiclesService.findAllForPartner(partnerId);
  }
}
