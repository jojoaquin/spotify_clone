import {
  Entity,
  Column,
  BaseEntity,
  BeforeInsert,
  PrimaryColumn,
  OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { Music } from "./Music";
import { Playlist } from "./Playlist";

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

  @Column("text", { nullable: true })
  password: string;

  @Column("enum", { enum: Gender, default: Gender.MALE, nullable: true })
  gender: Gender;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @Column("boolean", { default: false })
  lockAccount: boolean;

  @Column("text", { nullable: true })
  googleId: string;

  @OneToMany(() => Music, (music) => music.user)
  musics: Music[];

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @BeforeInsert()
  async generateIdAndPassword() {
    const { nanoid } = await import("nanoid");
    this.id = nanoid(11);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }
}
