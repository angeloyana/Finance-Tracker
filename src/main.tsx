import '@/global.css';

import { Capacitor } from '@capacitor/core';
import CssBaseline from '@mui/material/CssBaseline';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { closeDatabase, initDatabase } from '@/lib/db';
import settings from '@/lib/settings';

import App from './App.tsx';

(async () => {
  if (Capacitor.getPlatform() === 'web') {
    jeepSqlite(window);
    const jeepSqliteEl = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepSqliteEl);
    await customElements.whenDefined('jeep-sqlite');
  }

  await settings.init();
  await initDatabase();
  window.addEventListener('beforeunload', closeDatabase);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <CssBaseline />
      <App />
    </StrictMode>
  );
})();
