import { useState } from "react";

export const useSettingsState = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const [numTopTracks, setNumTopTracks] = useState(1);

  return { isSettingsOpen, openSettings, closeSettings, numTopTracks, setNumTopTracks };
};
