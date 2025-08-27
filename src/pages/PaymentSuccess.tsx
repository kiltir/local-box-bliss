
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when the user reaches the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Paiement réussi !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Merci pour votre commande ! Votre paiement a été traité avec succès.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Vous recevrez bientôt un email de confirmation avec les détails de votre commande.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <Button 
                onClick={() => navigate('/mes-commandes')}
                className="w-full bg-leaf-green hover:bg-dark-green text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Voir mes commandes
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>
                Des questions ? Contactez notre service client à{' '}
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

export default PaymentSuccess;
