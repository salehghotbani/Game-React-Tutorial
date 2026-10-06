import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { store } from './store';
import { GamePage } from './pages/GamePage';
import { LocaleProvider } from './i18n/LocaleProvider';
import './styles.css';
import './activities.css';
import './components/touchMovement.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Provider store={store}><LocaleProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LocaleProvider></Provider>
    </ChakraProvider>
  </StrictMode>
);
