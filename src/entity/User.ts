import {
  Entity,
  Column,
  BaseEntity,
  BeforeInsert,
  PrimaryColumn,
} from "typeorm";
import bcrypt from "bcrypt";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column("varchar", { length: 255 })
  username: string;

  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("text")
  password: string;

  @Column("enum", { enum: Gender, default: Gender.MALE, nullable: true })
  gender: Gender;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @BeforeInsert()
  async generateIdAndPassword() {
    const { nanoid } = await import("nanoid");
    this.id = nanoid(11);
    this.password = await bcrypt.hash(this.password, 12);
  }
}
