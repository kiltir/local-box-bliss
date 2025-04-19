
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { Product } from '@/types/box';

interface CustomProductFormProps {
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const CustomProductForm: React.FC<CustomProductFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      width: 5,
      height: 5,
      depth: 5,
      color: '#8B4513'
    }
  });

  const handleSubmit = (data) => {
    const newProduct: Product = {
      id: Date.now(),
      name: data.name,
      width: Number(data.width),
      height: Number(data.height),
      depth: Number(data.depth),
      color: data.color
    };
    
    onSubmit(newProduct);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl>
                <Input placeholder="Nom du produit" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largeur (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="0.1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hauteur (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="0.1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="depth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profondeur (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="0.1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couleur</FormLabel>
              <FormControl>
                <Input type="color" className="h-10 w-full" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Ajouter</Button>
      </form>
    </Form>
  );
};

export default CustomProductForm;
