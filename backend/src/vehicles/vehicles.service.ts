import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private readonly usersService: UsersService,
  ) {}

  async createForPartner(partnerId: string, dto: CreateVehicleDto): Promise<Vehicle> {
    const partner = await this.usersService.findById(partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    const vehicle = this.vehiclesRepository.create({
      ...dto,
      partner,
    });

    return this.vehiclesRepository.save(vehicle);
  }

  findAllForPartner(partnerId: string): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      where: { partner: { id: partnerId } },
      relations: ['partner'],
    });
  }
}
