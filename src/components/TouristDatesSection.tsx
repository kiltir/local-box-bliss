
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plane, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const TouristDatesSection = () => {
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);

  const handlePlanPurchase = () => {
    if (arrivalDate && departureDate) {
      // Logic for planning purchase - could scroll to boxes section or show a modal
      document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const canPlanPurchase = arrivalDate && departureDate;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#FEF7CD]/30">
      <div className="container-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-8 w-8 text-leaf-green mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Vous êtes en voyage à la Réunion ?</h2>
          </div>
          
          <p className="text-xl text-gray-600 mb-8">
            Planifiez vos achats selon vos dates de séjour. Achetez maintenant pour découvrir nos produits locaux, 
            ou programmez votre commande pour votre vol retour !
          </p>

          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Date d'arrivée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'arrivée à la Réunion
                </label>
                <Popover open={showArrivalPicker} onOpenChange={setShowArrivalPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !arrivalDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {arrivalDate ? format(arrivalDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={arrivalDate}
                      onSelect={(date) => {
                        setArrivalDate(date);
                        setShowArrivalPicker(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date de départ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de départ de la Réunion
                </label>
                <Popover open={showDeparturePicker} onOpenChange={setShowDeparturePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={(date) => {
                        setDepartureDate(date);
                        setShowDeparturePicker(false);
                      }}
                      disabled={(date) => date < (arrivalDate || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {canPlanPurchase && (
              <div className="border-t pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-leaf-green hover:bg-dark-green text-white px-6 py-3"
                    onClick={handlePlanPurchase}
                  >
                    <Plane className="mr-2 h-4 w-4" />
                    Acheter maintenant
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-leaf-green text-leaf-green hover:bg-leaf-green/10 px-6 py-3"
                    onClick={handlePlanPurchase}
                  >
                    Programmer pour le retour
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Séjour prévu du {format(arrivalDate!, "dd/MM", { locale: fr })} au {format(departureDate!, "dd/MM/yyyy", { locale: fr })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TouristDatesSection;
