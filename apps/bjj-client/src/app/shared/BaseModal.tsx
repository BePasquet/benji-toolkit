import { Close } from '@mui/icons-material';
import { IconButton, Modal } from '@mui/material';
import { PropsWithChildren } from 'react';

export interface BaseModalProps {
  open: boolean;
  onClose: VoidFunction;
}

export function BaseModal({
  children,
  open,
  onClose,
}: PropsWithChildren<BaseModalProps>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          width: '800px',
          height: '600px',
          borderRadius: '8px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        {children}
      </div>
    </Modal>
  );
}
