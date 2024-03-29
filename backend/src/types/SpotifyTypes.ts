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

export interface SpotifyAddTracksReqBody {
  uris: string[];
  position?: 0;
}

export interface SpotifyRemoveTracksReqBody {
  tracks: {
    uri: string;
  }[];
  snapshot_id?: string;
}
