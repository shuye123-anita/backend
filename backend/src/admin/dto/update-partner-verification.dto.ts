import { IsEnum } from 'class-validator';
import { VerificationStatus } from '../../users/user.entity';

export class UpdatePartnerVerificationDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;
}
