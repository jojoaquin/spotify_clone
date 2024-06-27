import {
  Entity,
  Column,
  BaseEntity,
  BeforeInsert,
  PrimaryColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("musics")
export class Music extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column("varchar", { length: 255 })
  title: string;

  @Column("text")
  pictureUrl: string;

  @Column("text")
  musicUrl: string;

  @ManyToOne(() => User, (user) => user.musics)
  user: User;

  @BeforeInsert()
  async generateIdAndPassword() {
    const { nanoid } = await import("nanoid");
    this.id = nanoid(11);
  }
}
