'use client';

import React from 'react';
import { ClubProfileModal } from './clubs/ClubProfileModal';

interface ClubProfileHubModalProps {
  isOpen: boolean;
  teamName: string | null;
  onClose: () => void;
}

export const ClubProfileHubModal: React.FC<ClubProfileHubModalProps> = (props) => {
  return <ClubProfileModal {...props} />;
};
