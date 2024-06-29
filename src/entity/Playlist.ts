import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("playlists")
export class Playlist extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column("varchar", { length: 255 })
  name: string;

  @Column("simple-array")
  musicIds: string[];

  @Column("varchar")
  userId: string;

  @ManyToOne(() => User, (user) => user.musics, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @BeforeInsert()
  async generateId() {
    const { nanoid } = await import("nanoid");
    this.id = nanoid(11);
    this.musicIds = [];
  }
}
