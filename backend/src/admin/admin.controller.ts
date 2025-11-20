import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { VerificationStatus } from '../users/user.entity';
import { VehicleStatus } from '../vehicles/vehicle.entity';
import { AdminService } from './admin.service';
import { UpdatePartnerVerificationDto } from './dto/update-partner-verification.dto';
import { UpdateVehicleStatusDto } from './dto/update-vehicle-status.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  getOverview() {
    return this.adminService.getOverview();
  }

  @Get('partners/pending')
  getPendingPartners() {
    return this.adminService.getPendingPartners();
  }

  @Get('vehicles/pending')
  getPendingVehicles() {
    return this.adminService.getPendingVehicles();
  }

  @Patch('partners/:id/verification')
  updatePartnerVerification(
    @Param('id') id: string,
    @Body() body: UpdatePartnerVerificationDto,
  ) {
    const status = body.status as VerificationStatus;
    return this.adminService.updatePartnerVerification(id, status);
  }

  @Patch('vehicles/:id/status')
  updateVehicleStatus(
    @Param('id') id: string,
    @Body() body: UpdateVehicleStatusDto,
  ) {
    const status = body.status as VehicleStatus;
    return this.adminService.updateVehicleStatus(id, status);
  }
}
