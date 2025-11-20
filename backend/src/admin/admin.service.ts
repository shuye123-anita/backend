import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User, UserRole, VerificationStatus } from '../users/user.entity';
import { Vehicle, VehicleStatus } from '../vehicles/vehicle.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}

  async getOverview() {
    const [totalUsers, totalVehicles, pendingRenters, pendingPartners, pendingVehicles] =
      await Promise.all([
        this.usersRepository.count(),
        this.vehiclesRepository.count(),
        this.usersRepository.count({
          where: { role: UserRole.RENTER, verificationStatus: VerificationStatus.PENDING },
        }),
        this.usersRepository.count({
          where: { role: UserRole.PARTNER, verificationStatus: VerificationStatus.PENDING },
        }),
        this.vehiclesRepository.count({
          where: { status: In([VehicleStatus.DRAFT, VehicleStatus.PENDING_APPROVAL]) },
        }),
      ]);

    const activeVehicles = await this.vehiclesRepository.count({ where: { status: VehicleStatus.ACTIVE } });

    return {
      totalUsers,
      totalVehicles,
      activeVehicles,
      pendingRenters,
      pendingPartners,
      pendingVehicles,
    };
  }

  getPendingPartners() {
    return this.usersRepository.find({
      where: { role: UserRole.PARTNER, verificationStatus: VerificationStatus.PENDING },
      order: { id: 'DESC' },
    });
  }

  getPendingVehicles() {
    return this.vehiclesRepository.find({
      where: { status: In([VehicleStatus.DRAFT, VehicleStatus.PENDING_APPROVAL]) },
      relations: ['partner'],
      order: { year: 'DESC' as any },
    });
  }

  async updatePartnerVerification(id: string, status: VerificationStatus) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user || user.role !== UserRole.PARTNER) {
      throw new NotFoundException('Partner not found');
    }
    user.verificationStatus = status;
    return this.usersRepository.save(user);
  }

  async updateVehicleStatus(id: string, status: VehicleStatus) {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    vehicle.status = status;
    return this.vehiclesRepository.save(vehicle);
  }
}
