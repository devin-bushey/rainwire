export interface SpotifyUserDataType {
  firstName: string;
  user_name: string;
  user_id: string;
  new_playlist_id: string;
  access: boolean;
  error?: boolean;
}

export interface SpotifyPlaylistDataType {
  id?: string;
  new_playlist_id?: string;
  external_urls?: {
    spotify?: string;
  };
}
