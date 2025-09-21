import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PriorityMatrixPage() {
  const matrixImage = PlaceHolderImages.find(img => img.id === 'priority-matrix');

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Priority Matrix</h1>
      <p className="text-muted-foreground">Visualize task priorities to focus on what matters most.</p>
      <Card className="mt-6 overflow-hidden">
        <CardHeader>
          <CardTitle>Eisenhower Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          {matrixImage ? (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={matrixImage.imageUrl}
                alt={matrixImage.description}
                fill
                className="object-cover rounded-md"
                data-ai-hint={matrixImage.imageHint}
              />
            </div>
          ) : (
            <p>Priority matrix image not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
