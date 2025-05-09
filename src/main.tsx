import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import '@/css/jsvectormap.css'; // ✅ apenas essa
import 'flatpickr/dist/flatpickr.min.css';
import { supabase } from './lib/supabaseClient';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SessionContextProvider supabaseClient={supabase}>
    <Router>
      <App />
    </Router>
  </SessionContextProvider>,
);
