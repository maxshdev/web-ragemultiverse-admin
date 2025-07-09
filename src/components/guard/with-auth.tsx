// components/guard/with-auth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress'; // Importar el Progress de ShadCN

export function withAuth(Component: any) {
  return function AuthComponent(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado para manejar el loading
    const [progress, setProgress] = useState(0); // Estado para manejar el progreso

    useEffect(() => {
      let progressInterval: any;

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login'); // Redirigir si no hay token
      } else {
        setLoading(false); // Si hay token, no hay que mostrar el loading
      }

      // Incrementar el progreso mientras se espera
      if (loading) {
        progressInterval = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prevProgress + 10;
          });
        }, 100); // Incrementar cada 100ms
      }

      return () => clearInterval(progressInterval); // Limpiar el intervalo al desmontar
    }, [loading]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen space-y-4">
          <Progress value={progress} max={100} className="w-1/2" />
          <p className="text-sm">Verificando autenticación...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}