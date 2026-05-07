import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext<any>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState(null);
  return (
    <ModalContext.Provider value={{ 
      modal, 
      openContact: () => setModal('contact'),
      closeModal: () => setModal(null) 
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
