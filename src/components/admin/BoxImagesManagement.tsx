import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const BoxImagesManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des images des box</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Les images des box sont actuellement gérées directement dans le code source.
            Pour modifier les images, veuillez éditer les fichiers dans <code>src/data/boxes/</code>.
          </AlertDescription>
        </Alert>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Box Découverte</h3>
            <p className="text-sm text-muted-foreground">Fichier: src/data/boxes/decouverte.ts</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Box Racine</h3>
            <p className="text-sm text-muted-foreground">Fichier: src/data/boxes/tradition.ts</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Box Saison</h3>
            <p className="text-sm text-muted-foreground">Fichier: src/data/boxes/saison.ts</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Box Bourbon</h3>
            <p className="text-sm text-muted-foreground">Fichier: src/data/boxes/bourbon.ts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
