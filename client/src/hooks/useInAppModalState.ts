import { useState } from "react";

export const useInAppModalState = () => {
  const [isInAppModalOpen, setIsInAppModalOpen] = useState(false);
  const openInAppModal = () => setIsInAppModalOpen(true);
  const closeInAppModal = () => setIsInAppModalOpen(false);

  return { isInAppModalOpen, openInAppModal, closeInAppModal };
};
