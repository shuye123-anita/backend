import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Controller('partners')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createPartner(@Body() dto: CreatePartnerDto) {
    return this.usersService.createPartner(dto);
  }
}
