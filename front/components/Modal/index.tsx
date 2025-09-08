import React, { useCallback } from 'react';
import { CloseModalButton, CreateModal } from './styles';

interface Props {
  children: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
}

const Modal = ({ children, show, onCloseModal }: Props) => {
  const stopPropagation = useCallback((event: any) => {
    event.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
