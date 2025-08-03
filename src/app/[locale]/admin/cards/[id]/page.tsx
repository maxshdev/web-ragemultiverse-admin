'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Card = {
  id: string;
  code: string;
  name: string;
  rarity: string;
  attribute?: string;
  species?: string;
  cost?: number;
  mission?: string;
  legend?: string;
  damage?: string;
  version?: string;
  image?: string;
};

export default function EditCardPage() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('Admin.Cards');

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Error fetching card');
        const data = await res.json();
        setCard(data);
        setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL}/cards/${data.id}/image`);
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar la carta.');
      }
    };

    fetchCard();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!card) return;
    const { name, value } = e.target;
    setCard({ ...card, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeMB = 2;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Validar tamaño
    if (file.size > maxSizeBytes) {
      toast.error(`La imagen supera el límite de ${maxSizeMB}MB.`);
      return;
    }

    // Validar tipo webp
    if (file.type !== 'image/webp') {
      toast.error('Solo se permiten imágenes en formato WebP.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedFile) return true;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${id}/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      toast.error('Error al subir la imagen.');
      return false;
    }

    toast.success('Imagen subida correctamente.');
    setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL}/cards/${id}/image?updated=${Date.now()}`);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    setLoading(true);

    try {
      const imageUploaded = await uploadImage(); // sube imagen si hay
      if (!imageUploaded) return;

      const token = localStorage.getItem('token');
      const { id: _, created_at, updated_at, ...dataToSend } = card as any;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...dataToSend, image: undefined }),
      });

      if (!res.ok) throw new Error('Update failed');

      toast.success('Carta actualizada correctamente');
      router.push(`/admin/cards/${card.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar la carta.');
    } finally {
      setLoading(false);
    }
  };

  if (!card) return <p>{t('loading')}...</p>;

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Editar Carta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto py-10">
            {[
              'code',
              'name',
              'rarity',
              'attribute',
              'species',
              'cost',
              'damage',
              'version',
            ].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{t(field)}</Label>
                <Input
                  id={field}
                  name={field}
                  type={field === 'cost' ? 'number' : 'text'}
                  value={card[field as keyof Card] ?? ''}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div>
              <Label htmlFor="image">{t('image')}</Label>
              <Input
                id="image"
                type="file"
                accept="image/webp"
                onChange={handleImageChange}
              />
              {previewUrl && (
                <div className="mt-4 rounded-md border p-4">
                  <p className="mb-2 text-sm text-muted-foreground">Vista previa:</p>
                  <img
                    src={previewUrl}
                    alt="Vista previa de la imagen"
                    className="rounded-md w-auto max-h-64 object-contain border"
                  />
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? t('saving') + '...' : t('save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
