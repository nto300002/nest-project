import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
  export class Item {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    todo: string;

    @Column('datetime')
    limit: Date;

    @Column('boolean', {default: false})
    idDone: boolean;

    @Column()
    deletePassword: string;

    @CreateDateColumn()
    readonly createAt?: Date;

    @UpdateDateColumn()
    readonly updateAt?: Date;
  }
