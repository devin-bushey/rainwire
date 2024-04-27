import { useContext, useEffect, useState } from "react";
import { CreateNewPlaylist } from "../apiManager/RecordShop";
import { SnackBarContext } from "../App";
import { goToNewTabOnDesktop } from "../utils/browserUtils";
import { useAuth } from "../context/AuthContext";
import { Gig } from "../types/Gig";

type PlaylistStateProps = {
  dbCollectionName: string;
  numTopTracks: number;
  overrideGigs?: Gig[];
};

export const useCreatePlaylistState = ({ dbCollectionName, numTopTracks, overrideGigs }: PlaylistStateProps) => {
  const { token, spotifyInfo } = useAuth();

  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isErrorCreatingPlaylist, setIsErrorCreatingPlaylist] = useState(false);
  const snackBar = useContext(SnackBarContext);

  useEffect(() => {
    if (isErrorCreatingPlaylist) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Error creating playlist. Please try again.",
        isError: true,
      });
    }
  }, [isErrorCreatingPlaylist]);

  const handleCreatePlaylist = async () => {
    setIsCreatingPlaylist(true);
    await CreateNewPlaylist({
      city: dbCollectionName,
      token,
      user_id: spotifyInfo.user_id,
      numTopTracks,
      overrideGigs,
    })
      .then((res) => {
        if (res.status === 201) {
          snackBar.setSnackBar({
            showSnackbar: true,
            setShowSnackbar: () => true,
            message: "Successfully created a playlist!",
            isError: false,
          });
          goToNewTabOnDesktop(res.data);
        } else {
          setIsErrorCreatingPlaylist(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsErrorCreatingPlaylist(true);
      });
    setIsCreatingPlaylist(false);
  };

  return {
    isCreatingPlaylist,
    setIsCreatingPlaylist,
    isErrorCreatingPlaylist,
    setIsErrorCreatingPlaylist,
    handleCreatePlaylist,
  };
};
