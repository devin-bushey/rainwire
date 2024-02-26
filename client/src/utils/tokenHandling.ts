export const setSpotifyTokenLocalStorage = (token: string) => {
  localStorage.setItem("spotifyToken", token);
  return token;
};

export const getSpotifyTokenLocalStorage = () => {
  const token = localStorage.getItem("spotifyToken") as string;
  if (token === null) {
    return null;
  }
  return token;
};
