
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { BoxProduct } from '@/types/boxes';
import { Lightbulb, Coffee, Leaf, Sparkles } from 'lucide-react';

interface BoxDetailsAdviceProps {
  products: BoxProduct[];
  boxTheme: 'Découverte' | 'Bourbon' | 'Racine' | 'Saison';
}

const BoxDetailsAdvice = ({
  products,
  boxTheme
}: BoxDetailsAdviceProps) => {
  // Conseils spécifiques par type de produit
  const getProductAdvice = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('café')) {
      return {
        icon: <Coffee className="h-5 w-5 text-amber-600" />,
        title: "Conservation du café",
        advice: "Conservez votre café dans un endroit sec et frais, à l'abri de la lumière. Une fois ouvert, consommez-le dans les 2-3 semaines pour préserver tous ses arômes."
      };
    }
    if (name.includes('thé')) {
      return {
        icon: <Leaf className="h-5 w-5 text-green-600" />,
        title: "Préparation du thé",
        advice: "Infusez 2-3 minutes dans une eau à 85°C pour les thés verts, 95°C pour les thés noirs. Utilisez 1 cuillère à café par tasse."
      };
    }
    if (name.includes('vanille')) {
      return {
        icon: <Sparkles className="h-5 w-5 text-purple-600" />,
        title: "Utilisation de la vanille",
        advice: "Fendez la gousse en deux et grattez les graines avec un couteau. Conservez la gousse dans du sucre pour l'aromatiser naturellement."
      };
    }
    if (name.includes('miel')) {
      return {
        icon: <Lightbulb className="h-5 w-5 text-yellow-600" />,
        title: "Conservation du miel",
        advice: "Le miel se conserve indéfiniment à température ambiante. S'il cristallise, réchauffez-le doucement au bain-marie pour retrouver sa texture liquide."
      };
    }
    if (name.includes('chocolat')) {
      return {
        icon: <Sparkles className="h-5 w-5 text-brown-600" />,
        title: "Dégustation du chocolat",
        advice: "Laissez fondre le chocolat sur votre langue pour révéler tous ses arômes. Conservez-le entre 16-18°C à l'abri de l'humidité."
      };
    }
    if (name.includes('bière')) {
      return {
        icon: <Coffee className="h-5 w-5 text-amber-700" />,
        title: "Service de la bière",
        advice: "Servez bien fraîche (6-8°C) dans un verre propre légèrement incliné. Versez lentement pour obtenir une mousse crémeuse."
      };
    }
    if (name.includes('biscuit') || name.includes('sablé')) {
      return {
        icon: <Lightbulb className="h-5 w-5 text-orange-600" />,
        title: "Conservation des biscuits",
        advice: "Conservez dans une boîte hermétique pour garder le croustillant. Parfaits avec un thé ou un café pour le goûter."
      };
    }
    if (name.includes('confiture')) {
      return {
        icon: <Leaf className="h-5 w-5 text-red-600" />,
        title: "Conservation de la confiture",
        advice: "Une fois ouverte, conservez au réfrigérateur et consommez dans le mois. Utilisez une cuillère propre à chaque utilisation."
      };
    }
    return null;
  };

  // Conseils généraux par thème
  const getThemeAdvice = () => {
    switch (boxTheme) {
      case 'Découverte':
        return {
          title: "Informations",
          advice: "Avant de s'appeler Réunion, l'île fût appelée Ile Bourbon, c'est pour cela que beaucoup de nos produits possèdent cette appellation historique et culturelle."
        };
      case 'Bourbon':
        return {
          title: "Informations",
          advice: "Avant de s'appeler Réunion, l'île fût appelée \"Ile Bourbon\", c'est pour cela que beaucoup de produits réunionnais possèdent cette appellation historique et culturelle héritée de la maison royale française du même nom."
        };
      case 'Racine':
        return {
          title: "Informations",
          advice: "Ces produits traditionnels racontent une histoire. Savourez-les en famille ou entre amis pour partager ces saveurs authentiques."
        };
      case 'Saison':
        return {
          title: "Informations",
          advice: "A la Réunion, il n'y a que 2 saisons :\n- l'été austral, saison chaude et humide, de novembre à avril\n- l'hiver austral, saison fraîche et sèche, de mai à octobre"
        };
      default:
        return {
          title: "Conseils généraux",
          advice: "Dégustez ces produits locaux avec attention et partagez ces moments de découverte avec vos proches."
        };
    }
  };

  // Explication du nom de la box par thème
  const getBoxNameExplanation = () => {
    switch (boxTheme) {
      case 'Saison':
        return {
          title: 'Pourquoi "Saison" ?',
          explanation: "La Box Saison adapte ses produits selon la saison, c'est un gage de qualité, de fraîcheur et d'authenticité pour les produits."
        };
      case 'Racine':
        return {
          title: 'Pourquoi "Racine" ?',
          explanation: "La Box Racine fait appel aux souvenirs des traditions, coutumes et recettes réunionnaises."
        };
      case 'Bourbon':
        return {
          title: 'Pourquoi "Bourbon" ?',
          explanation: "La Box Bourbon est née de l'histoire, du savoir-faire et de la qualité des produits d'un territoire d'exception."
        };
      case 'Découverte':
        return {
          title: 'Pourquoi "Découverte" ?',
          explanation: "La Box Découverte est vouée à faire connaître de nouveaux produits et de nouvelles saveurs de l'île de la Réunion."
        };
      default:
        return {
          title: 'Pourquoi cette box ?',
          explanation: "Chaque box a été pensée avec soin pour vous offrir une expérience unique."
        };
    }
  };

  const themeAdvice = getThemeAdvice();
  const boxNameExplanation = getBoxNameExplanation();

  return (
    <TabsContent value="advice" className="p-3 sm:p-6 pt-3 sm:pt-4">
      <div className="space-y-6">
        {/* Conseil général du thème */}
        <div className="bg-leaf-green/5 border border-leaf-green/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="h-6 w-6 text-leaf-green" />
            <h3 className="text-lg font-semibold text-leaf-green">{themeAdvice.title}</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{themeAdvice.advice}</p>
        </div>

        {/* Conseils spécifiques par produit */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Conseils par produit</h3>
          <div className="space-y-4">
            {products.map((product, index) => {
              const advice = getProductAdvice(product.name);
              if (!advice) return null;
              return (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {advice.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">{advice.title}</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">{advice.advice}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explication du nom de la box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-medium text-blue-900">{boxNameExplanation.title}</h3>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">{boxNameExplanation.explanation}</p>
        </div>
      </div>
    </TabsContent>
  );
};

export default BoxDetailsAdvice;
