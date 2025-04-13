
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import BoxCard from '@/components/BoxCard';
import ProducerSection from '@/components/ProducerSection';
import Footer from '@/components/Footer';
import BoxDetails from '@/components/BoxDetails';

const Index = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  
  const boxes = [
    {
      id: 1,
      title: "Petite Box", // Updated from "Box Petite"
      price: 19.99,
      description: "La box idéale pour une personne ou un petit foyer, contenant une sélection de produits frais et locaux de saison.",
      image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
      items: 7,
      size: 'small',
      products: [
        { name: "Carottes", quantity: "500g", producer: "Ferme des Trois Chênes" },
        { name: "Pommes de terre", quantity: "1kg", producer: "Ferme des Trois Chênes" },
        { name: "Salade", quantity: "1 pièce", producer: "Ferme des Trois Chênes" },
        { name: "Pommes", quantity: "4 pièces", producer: "Les Vergers d'Émilie" },
        { name: "Fromage de chèvre", quantity: "150g", producer: "Fromagerie du Vallon" },
        { name: "Yaourt nature", quantity: "2 pots", producer: "Fromagerie du Vallon" },
        { name: "Pain de campagne", quantity: "400g", producer: "Boulangerie Traditionnelle" }
      ]
    },
    {
      id: 2,
      title: "Moyenne Box", // Updated from "Box Moyenne"
      price: 34.99,
      description: "Parfaite pour un couple ou un foyer de 3-4 personnes, cette box contient une variété plus large de produits locaux.",
      image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
      items: 10,
      size: 'medium',
      products: [
        { name: "Carottes", quantity: "1kg", producer: "Ferme des Trois Chênes" },
        { name: "Pommes de terre", quantity: "2kg", producer: "Ferme des Trois Chênes" },
        { name: "Salade", quantity: "1 pièce", producer: "Ferme des Trois Chênes" },
        { name: "Courgettes", quantity: "500g", producer: "Ferme des Trois Chênes" },
        { name: "Pommes", quantity: "6 pièces", producer: "Les Vergers d'Émilie" },
        { name: "Poires", quantity: "4 pièces", producer: "Les Vergers d'Émilie" },
        { name: "Fromage de chèvre", quantity: "200g", producer: "Fromagerie du Vallon" },
        { name: "Yaourt nature", quantity: "4 pots", producer: "Fromagerie du Vallon" },
        { name: "Pain de campagne", quantity: "800g", producer: "Boulangerie Traditionnelle" },
        { name: "Miel de fleurs", quantity: "250g", producer: "Le Rucher de Jean" }
      ]
    },
    {
      id: 3,
      title: "Grande Box", // Updated from "Box Grande"
      price: 49.99,
      description: "Notre box la plus complète, idéale pour une famille ou pour partager. Une gamme étendue de produits frais et d'épicerie.",
      image: "https://source.unsplash.com/1582562124811-c09040d0a901",
      items: 15,
      size: 'large',
      products: [
        { name: "Carottes", quantity: "1.5kg", producer: "Ferme des Trois Chênes" },
        { name: "Pommes de terre", quantity: "3kg", producer: "Ferme des Trois Chênes" },
        { name: "Salade", quantity: "2 pièces", producer: "Ferme des Trois Chênes" },
        { name: "Courgettes", quantity: "1kg", producer: "Ferme des Trois Chênes" },
        { name: "Tomates", quantity: "1kg", producer: "Ferme des Trois Chênes" },
        { name: "Pommes", quantity: "8 pièces", producer: "Les Vergers d'Émilie" },
        { name: "Poires", quantity: "6 pièces", producer: "Les Vergers d'Émilie" },
        { name: "Fraises", quantity: "500g", producer: "Les Vergers d'Émilie" },
        { name: "Fromage de chèvre", quantity: "300g", producer: "Fromagerie du Vallon" },
        { name: "Camembert", quantity: "250g", producer: "Fromagerie du Vallon" },
        { name: "Yaourt nature", quantity: "6 pots", producer: "Fromagerie du Vallon" },
        { name: "Pain de campagne", quantity: "1kg", producer: "Boulangerie Traditionnelle" },
        { name: "Miel de fleurs", quantity: "500g", producer: "Le Rucher de Jean" },
        { name: "Confiture de fraises", quantity: "350g", producer: "Les Délices du Verger" },
        { name: "Jus de pomme", quantity: "1L", producer: "Les Vergers d'Émilie" }
      ]
    }
  ];
  
  const handleBoxClick = (id: number) => {
    setSelectedBox(id);
  };
  
  const handleCloseDetails = () => {
    setSelectedBox(null);
  };
  
  const getSelectedBoxDetails = () => {
    return boxes.find(box => box.id === selectedBox);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main>
        <Hero />
        
        <FeaturesSection />
        
        <section id="boxes" className="py-16">
          <div className="container-section">
            <div className="text-center mb-12 fade-in">
              <h2 className="text-3xl font-bold mb-4">Découvrez nos box</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choisissez la formule qui correspond le mieux à vos besoins. Toutes nos box sont composées de produits frais et locaux, sélectionnés avec soin.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
              {boxes.map((box) => (
                <BoxCard
                  key={box.id}
                  title={box.title}
                  price={box.price}
                  description={box.description}
                  image={box.image}
                  items={box.items}
                  size={box.size as 'small' | 'medium' | 'large'}
                  onClick={() => handleBoxClick(box.id)}
                />
              ))}
            </div>
          </div>
        </section>
        
        <ProducerSection />
        
        <section className="py-16 bg-leaf-green text-white">
          <div className="container-section">
            <div className="max-w-3xl mx-auto text-center fade-in">
              <h2 className="text-3xl font-bold mb-4">Prêt à goûter nos produits locaux ?</h2>
              <p className="text-xl mb-8">
                Commandez dès maintenant votre première box et découvrez la fraîcheur et la qualité des produits de nos producteurs locaux.
              </p>
              <button className="bg-white text-leaf-green hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg">
                Commander ma box
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {selectedBox !== null && getSelectedBoxDetails() && (
        <BoxDetails
          title={getSelectedBoxDetails()!.title}
          price={getSelectedBoxDetails()!.price}
          description={getSelectedBoxDetails()!.description}
          image={getSelectedBoxDetails()!.image}
          products={getSelectedBoxDetails()!.products}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Index;
