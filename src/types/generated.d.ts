export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  errors?: Maybe<Array<Error>>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Error = {
  __typename?: 'Error';
  message: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type Music = {
  __typename?: 'Music';
  id: Scalars['ID']['output'];
  musicUrl: Scalars['String']['output'];
  pictureUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
  user: User;
};

export type MusicResponse = {
  __typename?: 'MusicResponse';
  errors?: Maybe<Array<Error>>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMusicToPlaylist: PlaylistResponse;
  createMusic: MusicResponse;
  createPlaylist: PlaylistResponse;
  deleteMusic: MusicResponse;
  forgotPasswordChange: AuthResponse;
  login: AuthResponse;
  logout: AuthResponse;
  register: AuthResponse;
  removeMusicFromPlaylist: PlaylistResponse;
  sendForgotPasswordEmail: AuthResponse;
  updateMusic: MusicResponse;
};


export type MutationAddMusicToPlaylistArgs = {
  musicId: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
};


export type MutationCreateMusicArgs = {
  files: Array<Scalars['Upload']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreatePlaylistArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteMusicArgs = {
  id: Scalars['String']['input'];
};


export type MutationForgotPasswordChangeArgs = {
  key: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRemoveMusicFromPlaylistArgs = {
  musicId: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
};


export type MutationSendForgotPasswordEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateMusicArgs = {
  files?: InputMaybe<Array<Scalars['Upload']['input']>>;
  musicId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Playlist = {
  __typename?: 'Playlist';
  id: Scalars['ID']['output'];
  musics?: Maybe<Array<Music>>;
  name: Scalars['String']['output'];
};

export type PlaylistResponse = {
  __typename?: 'PlaylistResponse';
  errors?: Maybe<Array<Error>>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Query = {
  __typename?: 'Query';
  findMusics: Array<Music>;
  hello: Scalars['String']['output'];
  me?: Maybe<User>;
  myPlaylist?: Maybe<Array<Playlist>>;
  searchMusics?: Maybe<Array<Music>>;
  viewMusic?: Maybe<Music>;
};


export type QuerySearchMusicsArgs = {
  title: Scalars['String']['input'];
};


export type QueryViewMusicArgs = {
  id: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};
