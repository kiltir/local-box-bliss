import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
const ProducerSection = () => {
  const producers = [{
    name: "Les Trésors de Mamie Céliane",
    specialty: "Produits bio",
    image: "https://source.unsplash.com/1472396961693-142e6e269027",
    description: "Céliane cultive des fruits et légumes bio depuis plus des années sur ses terres familiales et propose une multitude de produits bio issus de son savoir-faire."
  }, {
    name: "Terre'Api Des Hauts",
    specialty: "Miels artisanaux",
    image: "https://source.unsplash.com/1582562124811-c09040d0a901",
    description: "Christophe est un apiculteur péi passionné et engagé dans le respect et la bienveillance de la nature qui élabore un miel artisanal d'exception."
  }, {
    name: "Pot en ciel Kréol",
    specialty: "Lactofermentation",
    image: "https://source.unsplash.com/1465146344425-f00d5f5c8f07",
    description: "Mégane est une artisane spécialisée dans les préparations lactofermentées qu'elle élabore avec des produits locaux pour le bien-être de sa clientèle."
  }, {
    name: "Siro dé Ô",
    specialty: "Produits transformés",
    image: "https://source.unsplash.com/1558618666-fcd25c85cd64",
    description: "M. HUET est un artisan péi qui élabore une large gamme de sirops aux parfums multiples ou thérapeutiques."
  }];
  const autoplayPlugin = React.useRef(Autoplay({
    delay: 4000,
    stopOnInteraction: true
  }));
  return <section id="producers" className="bg-gradient-to-b from-white to-soft-beige/20 py-[15px] scroll-mt-[88px] md:scroll-mt-[80px]">
      <div className="container-section py-[15px]">
        <div className="text-center mb-12 fade-in">
          <h2 id="producers-title" className="text-3xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos artisans/producteurs passionnés qui travaillent chaque jour pour offrir le meilleur du territoire.
          </p>
        </div>
        
        <div className="fade-in px-12">
          <Carousel opts={{
          align: "start",
          loop: true
        }} plugins={[autoplayPlugin.current]} className="w-full">
            <CarouselContent className="-ml-4">
              {producers.map((producer, index) => <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
                    <div className="h-48">
                      <img src={producer.image} alt={producer.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="inline-block px-3 py-1 bg-leaf-green/10 text-leaf-green rounded-full text-sm font-medium mb-3">
                        {producer.specialty}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{producer.name}</h3>
                      <p className="text-gray-600">{producer.description}</p>
                    </div>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
        
        <div className="mt-16 text-center">
          <button className="text-leaf-green font-medium hover:underline inline-flex items-center">
              Devenir notre fournisseur
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>;
};
export default ProducerSection;