
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SignupSuccess = () => {
  const navigate = useNavigate();

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
              Inscription réussie !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Merci de rejoindre l'aventure KiltirBox ! Votre compte a bien été créé.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-green-700" />
                  <p className="text-green-800 font-medium">
                    Vérifiez votre boîte mail
                  </p>
                </div>
                <p className="text-green-700 text-sm">
                  Un email de confirmation vous a été envoyé. Cliquez sur le lien dans cet email pour activer votre compte et profiter pleinement de KiltirBox.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  💡 Pensez à vérifier vos spams si vous ne trouvez pas l'email dans votre boîte de réception.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6">
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

export default SignupSuccess;
