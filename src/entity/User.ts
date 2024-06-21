import {
  Entity,
  Column,
  BaseEntity,
  BeforeInsert,
  PrimaryColumn,
} from "typeorm";

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

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("enum", { enum: Gender, default: Gender.MALE, nullable: true })
  gender: Gender;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @BeforeInsert()
  async generateId() {
    const { nanoid } = await import("nanoid");
    this.id = nanoid(11);
  }
}
