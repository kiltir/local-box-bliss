import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

// Default FAQs to show while loading or if database is empty
const defaultFaqs = [
  {
    id: 'default-1',
    question: "Qu'est-ce qu'une KiltirBox ?",
    answer: "KiltirBox ce sont des box de produits locaux selon des thématiques originales et culturelles à récupérer sur place à l'aéroport ou livré en Métropole. Plus qu'un colis, c'est une vraie expérience que nous vous proposons.",
    display_order: 0
  },
  {
    id: 'default-2',
    question: "Comment fonctionne la livraison ?",
    answer: "Nous proposons 3 options : retrait à l'aéroport Roland Garros, livraison à la Réunion ou livraison en Métropole. La livraison peut être assurée par nos équipes, La Poste ou des transporteurs spécialisés pour garantir la qualité des produits.",
    display_order: 1
  },
  {
    id: 'default-3',
    question: "Les produits sont-ils vraiment locaux ?",
    answer: "Oui, tous nos produits sont issus du savoir-faire local de nos partenaires réunionnais passionnés et engagés. Nous travaillons directement avec les producteurs locaux.",
    display_order: 2
  },
  {
    id: 'default-4',
    question: "Puis-je personnaliser ma box ?",
    answer: "Nos box sont conçues selon des thématiques spécifiques pour vous offrir une expérience cohérente. Cependant, vous pouvez choisir parmi différentes thématiques disponibles.",
    display_order: 3
  },
  {
    id: 'default-5',
    question: "Quelle est la durée de conservation des produits ?",
    answer: "La durée de conservation varie selon les produits. Chaque box contient des informations détaillées sur la conservation et la consommation optimale de chaque produit. La durée de conservation est un des critères principaux de notre sélection. Donc les produits sont facilement conservables.",
    display_order: 4
  },
  {
    id: 'default-6',
    question: "Comment puis-je suivre ma commande ?",
    answer: "Une fois votre commande passée, vous recevrez un email de confirmation avec un numéro de suivi. Vous pourrez suivre l'évolution de votre livraison en temps réel.",
    display_order: 5
  },
  {
    id: 'default-7',
    question: "Que faire si je ne suis pas satisfait ?",
    answer: "Votre satisfaction est notre priorité. Si vous n'êtes pas entièrement satisfait de votre box, contactez-nous dans les 48h suivant réception et nous trouverons une solution.",
    display_order: 6
  },
  {
    id: 'default-8',
    question: "Y a-t-il un abonnement ?",
    answer: "Vous pouvez commander nos box à l'unité ou vous abonner pour recevoir régulièrement votre sélection de produits réunionnais. L'abonnement vous donne accès à des tarifs préférentiels.",
    display_order: 7
  }
];

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFaqs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase
        .from('faq')
        .select('id, question, answer, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setFaqs(data);
      }
      // If error or empty, keep default FAQs
      setLoading(false);
    };

    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#FEF7CD]/50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Foire aux questions</h1>
            
            <div className="mb-8">
              <p className="text-lg text-gray-700 text-center">
                Retrouvez ici les réponses aux questions les plus fréquemment posées sur KiltirBox.
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border">
                    <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:text-leaf-green">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Vous ne trouvez pas la réponse à votre question ?
              </p>
              <a 
                href="/nous-contacter" 
                className="inline-block bg-leaf-green hover:bg-dark-green text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Contactez-nous
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
