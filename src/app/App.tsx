import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { PreInscriptionProvider } from './context/PreInscriptionContext';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Track website visitors
    const visits = localStorage.getItem('omnicare_visits');
    const visitCount = visits ? parseInt(visits, 10) : 0;
    localStorage.setItem('omnicare_visits', (visitCount + 1).toString());
    
    // Track unique visitors (session-based)
    const hasVisitedThisSession = sessionStorage.getItem('omnicare_current_session');
    if (!hasVisitedThisSession) {
      sessionStorage.setItem('omnicare_current_session', 'true');
      const uniqueVisits = localStorage.getItem('omnicare_unique_visits');
      const uniqueCount = uniqueVisits ? parseInt(uniqueVisits, 10) : 0;
      localStorage.setItem('omnicare_unique_visits', (uniqueCount + 1).toString());
    }
  }, []);

  return (
    <AuthProvider>
      <PreInscriptionProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </PreInscriptionProvider>
    </AuthProvider>
  );
}