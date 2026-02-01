
import React, { useEffect, useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { BoxProduct } from '@/types/boxes';
import { Lightbulb, Coffee, Leaf, Sparkles, LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BoxDetailsAdviceProps {
  products: BoxProduct[];
  boxTheme: 'Découverte' | 'Bourbon' | 'Racine' | 'Saison';
}

interface BoxAdviceData {
  info_title: string;
  info_content: string;
  why_title: string;
  why_content: string;
}

interface ProductAdviceData {
  product_name: string;
  advice_title: string;
  advice_content: string;
  icon_name: string;
  icon_color: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Coffee,
  Leaf,
  Sparkles,
};

const BoxDetailsAdvice = ({
  products,
  boxTheme
}: BoxDetailsAdviceProps) => {
  const [boxAdvice, setBoxAdvice] = useState<BoxAdviceData | null>(null);
  const [productAdvice, setProductAdvice] = useState<ProductAdviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const [boxRes, productRes] = await Promise.all([
          supabase
            .from('box_advice')
            .select('info_title, info_content, why_title, why_content')
            .eq('theme', boxTheme)
            .single(),
          supabase
            .from('box_product_advice')
            .select('product_name, advice_title, advice_content, icon_name, icon_color')
            .eq('theme', boxTheme)
        ]);

        if (boxRes.data) {
          setBoxAdvice(boxRes.data);
        }
        if (productRes.data) {
          setProductAdvice(productRes.data);
        }
      } catch (error) {
        console.error('Error fetching advice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [boxTheme]);

  // Get advice for a specific product by exact name match
  const getProductAdvice = (productName: string) => {
    return productAdvice.find(advice => advice.product_name === productName);
  };

  const getIconComponent = (iconName: string): LucideIcon => {
    return ICON_MAP[iconName] || Lightbulb;
  };

  if (loading) {
    return (
      <TabsContent value="advice" className="p-3 sm:p-6 pt-3 sm:pt-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="advice" className="p-3 sm:p-6 pt-3 sm:pt-4">
      <div className="space-y-6">
        {/* Conseil général du thème */}
        {boxAdvice && (
          <div className="bg-leaf-green/5 border border-leaf-green/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="h-6 w-6 text-leaf-green" />
              <h3 className="text-lg font-semibold text-leaf-green">{boxAdvice.info_title}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{boxAdvice.info_content}</p>
          </div>
        )}

        {/* Conseils spécifiques par produit */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Conseils par produit</h3>
          <div className="space-y-4">
            {products.map((product, index) => {
              const advice = getProductAdvice(product.name);
              if (!advice) return null;
              
              const IconComponent = getIconComponent(advice.icon_name);
              
              return (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <IconComponent className={`h-5 w-5 ${advice.icon_color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">{advice.advice_title}</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">{advice.advice_content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explication du nom de la box */}
        {boxAdvice && boxAdvice.why_title && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-medium text-blue-900">{boxAdvice.why_title}</h3>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{boxAdvice.why_content}</p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default BoxDetailsAdvice;
