import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

const ProducerSection = () => {
  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const autoplayPlugin = React.useRef(Autoplay({
    delay: 4000,
    stopOnInteraction: true
  }));

  const defaultImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop";

  return (
    <section id="producers" className="bg-gradient-to-b from-white to-soft-beige/20 py-[15px] scroll-mt-[88px] md:scroll-mt-[80px]">
      <div className="container-section py-[15px]">
        <div className="text-center mb-12 fade-in">
          <h2 id="producers-title" className="text-3xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos artisans/producteurs passionnés qui travaillent chaque jour pour offrir le meilleur du territoire.
          </p>
        </div>
        
        <div className="fade-in px-12">
          {isLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1">
                  <Skeleton className="h-48 w-full rounded-t-xl" />
                  <div className="p-6 bg-white rounded-b-xl">
                    <Skeleton className="h-6 w-24 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : partners && partners.length > 0 ? (
            <Carousel 
              opts={{
                align: "start",
                loop: true
              }} 
              plugins={[autoplayPlugin.current]} 
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {partners.map((partner) => (
                  <CarouselItem key={partner.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
                      <div className="h-48">
                        <img 
                          src={partner.image_url || defaultImage} 
                          alt={partner.raison_sociale} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultImage;
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="inline-block px-3 py-1 bg-leaf-green/10 text-leaf-green rounded-full text-sm font-medium mb-3">
                          {partner.secteur_activite}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{partner.raison_sociale}</h3>
                        <p className="text-gray-600">{partner.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          ) : (
            <p className="text-center text-gray-500">Aucun partenaire disponible pour le moment.</p>
          )}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/devenir-fournisseur" className="text-leaf-green font-medium hover:underline inline-flex items-center">
            Devenir notre fournisseur
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProducerSection;
