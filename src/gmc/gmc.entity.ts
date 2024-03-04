import { Listing } from '../listing/listing.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gmc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  caption: string;

  @Column({ nullable: true, type: 'text' })
  img: string;

  @Column({ nullable: true, type: 'varchar' })
  calenderDate: string;

  @ManyToOne(() => Listing, (listing) => listing.gmcs, { onDelete: 'CASCADE' })
  listing: Listing;
}
