import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';
import { SharedFiles } from './pages/SharedFiles';

// Route-level code splitting: each marketing page loads on demand.
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Features = lazy(() => import('./pages/Features').then((m) => ({ default: m.Features })));
const Professionals = lazy(() =>
  import('./pages/Professionals').then((m) => ({ default: m.Professionals }))
);
const PreInscription = lazy(() =>
  import('./pages/PreInscription').then((m) => ({ default: m.PreInscription }))
);
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

export const router = createBrowserRouter([
  { path: '/login', element: <Navigate to="/admin/login" replace /> },
  { path: '/admin/login', Component: Login },
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  {
    path: '/admin/pre-inscriptions',
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/shared-files',
    element: (
      <ProtectedRoute>
        <SharedFiles />
      </ProtectedRoute>
    ),
  },
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
      { path: '*', Component: NotFound },
    ],
  },
]);
