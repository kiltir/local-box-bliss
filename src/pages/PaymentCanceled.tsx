
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Paiement annulé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Votre paiement a été annulé. Aucun montant n'a été débité.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Votre panier a été conservé. Vous pouvez reprendre votre commande à tout moment.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <Button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-leaf-green hover:bg-dark-green text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Réessayer le paiement
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>
                Besoin d'aide ? Contactez-nous à{' '}
                <a href="mailto:support@kiltirbox.com" className="text-leaf-green hover:underline">
                  support@kiltirbox.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentCanceled;
