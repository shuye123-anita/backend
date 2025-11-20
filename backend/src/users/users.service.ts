import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, VerificationStatus } from './user.entity';

interface CreatePartnerInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createPartner(input: CreatePartnerInput): Promise<User> {
    const user = this.usersRepository.create({
      email: input.email,
      password: input.password,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      phoneNumber: input.phoneNumber ?? null,
      role: UserRole.PARTNER,
      verificationStatus: VerificationStatus.PENDING,
    });

    return this.usersRepository.save(user);
  }
}
