import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Images placeholder - à enrichir avec les photos de la communauté
const communityImages = [
  "/lovable-uploads/kiltirbox-standard.jpg",
  "/lovable-uploads/ti-calicoco-boite.jpg",
  "/lovable-uploads/achard-mamie-celiane.jpg",
  "/lovable-uploads/piment-pei-mamie-celiane.jpg",
];

const CallToAction = () => {
  return (
    <section className="py-16 bg-leaf-yellow text-white">
      <div className="container-section py-[15px]">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Une expérience inédite à partager ?
          </h2>
          <p className="text-xl mb-8 text-slate-900">
            Vous avez commandé votre box ? Votre avis nous intéresse. Rejoignez la communauté !
          </p>
          
          {/* Carrousel de photos de la communauté */}
          <div className="relative px-12">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {communityImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3">
                    <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={image}
                        alt={`Photo communauté ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-white/80 hover:bg-white border-none text-slate-900" />
              <CarouselNext className="right-0 bg-white/80 hover:bg-white border-none text-slate-900" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
