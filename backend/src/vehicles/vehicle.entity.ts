import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Availability } from '../availability/availability.entity';

export enum VehicleStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.vehicles, { nullable: false })
  partner: User;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ unique: true })
  vin: string;

  @Column({ name: 'license_plate', unique: true })
  licensePlate: string;

  @Column({ name: 'photo_urls', type: 'simple-json', nullable: true })
  photoUrls: string[] | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'simple-json', nullable: true })
  features: Record<string, unknown> | null;

  @Column({ name: 'base_price_per_day', type: 'decimal', precision: 10, scale: 2 })
  basePricePerDay: number;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.DRAFT })
  status: VehicleStatus;

  @Column({ name: 'ownership_docs_url', nullable: true })
  ownershipDocsUrl: string | null;

  @OneToMany(() => Availability, (availability) => availability.vehicle)
  availabilitySlots: Availability[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
