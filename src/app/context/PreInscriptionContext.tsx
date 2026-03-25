import React, { createContext, useContext, useState, useEffect } from 'react';
import { preInscriptionAPI } from '../../services/api';

export interface PreInscription {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  profession: 'medecin' | 'infirmier' | 'psychologue' | 'kinesitherapeute';
  createdAt: string;
  status?: string;
}

interface PreInscriptionContextType {
  preInscriptions: PreInscription[];
  addPreInscription: (data: Omit<PreInscription, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  fetchPreInscriptions: () => Promise<void>;
  loading: boolean;
}

const PreInscriptionContext = createContext<PreInscriptionContextType | undefined>(undefined);

export function PreInscriptionProvider({ children }: { children: React.ReactNode }) {
  const [preInscriptions, setPreInscriptions] = useState<PreInscription[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPreInscriptions = async () => {
    try {
      setLoading(true);
      const data = await preInscriptionAPI.getAll();
      setPreInscriptions(data.map(item => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        dateOfBirth: item.dateOfBirth,
        email: item.email,
        phone: item.phone,
        profession: item.profession.toLowerCase() as 'medecin' | 'infirmier' | 'psychologue' | 'kinesitherapeute',
        createdAt: item.createdAt,
        status: item.status,
      })));
    } catch (error) {
      console.error('Failed to fetch pre-inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPreInscription = async (data: Omit<PreInscription, 'id' | 'createdAt' | 'status'>) => {
    try {
      await preInscriptionAPI.create({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        email: data.email,
        phone: data.phone,
        profession: data.profession.toUpperCase() as 'MEDECIN' | 'INFIRMIER' | 'PSYCHOLOGUE' | 'KINESITHERAPEUTE',
      });
      await fetchPreInscriptions();
    } catch (error) {
      console.error('Failed to create pre-inscription:', error);
      throw error;
    }
  };

  return (
    <PreInscriptionContext.Provider value={{ preInscriptions, addPreInscription, fetchPreInscriptions, loading }}>
      {children}
    </PreInscriptionContext.Provider>
  );
}

export function usePreInscription() {
  const context = useContext(PreInscriptionContext);
  if (!context) {
    throw new Error('usePreInscription must be used within PreInscriptionProvider');
  }
  return context;
}
