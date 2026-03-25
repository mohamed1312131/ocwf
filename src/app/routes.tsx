import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Professionals } from './pages/Professionals';
import { PreInscription } from './pages/PreInscription';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'fonctionnalites', Component: Features },
      { path: 'professionnels', Component: Professionals },
      { path: 'pre-inscription', Component: PreInscription },
      { path: 'a-propos', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'login', Component: Login },
      { 
        path: 'admin', 
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        )
      },
      { 
        path: 'admin/dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      { path: '*', Component: NotFound },
    ],
  },
]);