import React, { CSSProperties, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  children: React.ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}

const Menu = ({ children, style, show, onCloseModal, closeButton = true }: Props) => {
  const stopPropagation = useCallback((event: any) => {
    event.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
