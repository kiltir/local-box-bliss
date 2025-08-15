
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const NousContacter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#FEF7CD]/50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Nous contacter</h1>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold text-leaf-green mb-6">Contactez-nous</h2>
                <p className="text-gray-700 mb-8">
                  Vous avez une question, une suggestion ou souhaitez en savoir plus sur nos box ? 
                  N'hésitez pas à nous contacter, notre équipe sera ravie de vous répondre.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-leaf-green mr-4" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">contact@kiltirbox.re</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-leaf-green mr-4" />
                    <div>
                      <p className="font-semibold">Téléphone</p>
                      <p className="text-gray-600">+262 692 XX XX XX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-leaf-green mr-4" />
                    <div>
                      <p className="font-semibold">Adresse</p>
                      <p className="text-gray-600">La Réunion, France</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-leaf-green mb-6">Envoyez-nous un message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-leaf-green hover:bg-dark-green text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NousContacter;
