import { createContext, useContext } from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { isLoggedIntoSpotify, logOut, redirectToAuth } from "../utils/spotifyAuthUtils";
import { SpotifyUserDataType } from "../types/SpotifyTypes";

interface AuthContextType {
  token: string;
  spotifyInfo: SpotifyUserDataType;
  logOut: () => void;
  redirectToAuth: (redirectUri?: string) => void;
  isLoggedIntoSpotify: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, spotifyInfo } = useSpotifyAuth();

  return (
    <AuthContext.Provider value={{ token, logOut, spotifyInfo, redirectToAuth, isLoggedIntoSpotify }}>
      {children}
    </AuthContext.Provider>
  );
};
