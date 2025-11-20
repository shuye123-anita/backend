import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Availability, AvailabilityStatus } from './availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}

  async createForVehicle(
    vehicleId: string,
    dto: CreateAvailabilityDto,
  ): Promise<Availability> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const availability = this.availabilityRepository.create({
      vehicle,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      status: dto.status ?? AvailabilityStatus.AVAILABLE,
    });

    return this.availabilityRepository.save(availability);
  }

  findByVehicleId(vehicleId: string): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['vehicle'],
    });
  }
}
