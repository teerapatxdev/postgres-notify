import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TableName } from '../table.enum';

@Entity(TableName.USER, { schema: 'public' })
export class User {
  @PrimaryColumn({ type: 'uuid', name: 'user_id', default: () => 'gen_random_uuid()' })
  userId: string;

  @Column({ type: 'character varying', name: 'firstname', length: 200 })
  firstname: string;

  @Column({ type: 'character varying', name: 'lastname', length: 200 })
  lastname: string;

  @Column({ type: 'character varying', name: 'email', length: 200 })
  email: string;

  @Column({ type: 'character varying', name: 'phone_number', length: 10 })
  phoneNumber: string;

  @Column({ type: 'character varying', name: 'password', length: 200 })
  password: string;

  @Column({ type: 'int8', name: 'reward_point' })
  rewardPoint: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_date' })
  createdDate: string;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_date' })
  updatedDate: string;

  @Column({ type: 'uuid', name: 'updated_by' })
  updatedBy: string;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_date' })
  deletedDate: string;

  @Column({ type: 'uuid', name: 'deleted_by' })
  deletedBy: string;

  @Column({ type: 'text', name: 'remarks' })
  remarks: string;
}
