import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider } from '../features/auth/AuthContext';
import { ModalProvider } from '../features/modal/ModalContext';

export function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}
