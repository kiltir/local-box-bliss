import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Plane, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalHour, setArrivalHour] = useState<string>('12');
  const [arrivalMinute, setArrivalMinute] = useState<string>('00');
  const [departureHour, setDepartureHour] = useState<string>('14');
  const [departureMinute, setDepartureMinute] = useState<string>('00');
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showPickupDateModal, setShowPickupDateModal] = useState(false);
  const [selectedPickupDate, setSelectedPickupDate] = useState<'arrival' | 'departure'>('arrival');

  const handleAirportPickup = () => {
    if (arrivalDate && departureDate) {
      setShowPickupDateModal(true);
    }
  };

  const handleConfirmPickup = () => {
    setShowPickupDateModal(false);
    // Procéder à l'achat avec la date sélectionnée
    document.getElementById('boxes')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handlePlanPurchase = () => {
    if (arrivalDate && departureDate) {
      document.getElementById('boxes')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  const canPlanPurchase = arrivalDate && departureDate;

  // Generate hours (00-23)
  const hours = Array.from({
    length: 24
  }, (_, i) => i.toString().padStart(2, '0'));

  // Generate minutes (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'];

  const getSelectedPickupDetails = () => {
    if (selectedPickupDate === 'arrival' && arrivalDate) {
      return {
        date: arrivalDate,
        hour: arrivalHour,
        minute: arrivalMinute,
        label: 'arrivée'
      };
    } else if (selectedPickupDate === 'departure' && departureDate) {
      return {
        date: departureDate,
        hour: departureHour,
        minute: departureMinute,
        label: 'départ'
      };
    }
    return null;
  };

  return (
    <>
      <section style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/lovable-uploads/53d8e975-3996-441a-9ccd-8e5874f90880.png')`
      }} className="hero-section md:py-24 relative bg-cover bg-center bg-no-repeat py-[40px]">
        <div className="container-section py-[15px]">
          <div className="max-w-3xl mx-auto text-center slide-in py-[10px]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 mx-[16px]">
              La Réunion sur place ou à emporter
            </h1>
            
            {/* Section des dates de voyage */}
            <div className="max-w-4xl mx-auto text-center py-0">
              <div className="flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-leaf-green mr-3" />
                <h2 className="text-3xl font-bold text-white">
                  Vous êtes en voyage à la Réunion ?
                </h2>
              </div>
              
              <p className="text-xl text-white mb-8 font-normal">Renseignez vos dates 15 jours avant votre vol et profitez d'un service sur-mesure.*</p>

              <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Date d'arrivée */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'arrivée à la Réunion
                    </label>
                    <Popover open={showArrivalPicker} onOpenChange={setShowArrivalPicker}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !arrivalDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {arrivalDate ? format(arrivalDate, "PPP", {
                          locale: fr
                        }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={arrivalDate} onSelect={date => {
                        setArrivalDate(date);
                        setShowArrivalPicker(false);
                      }} disabled={date => date < new Date()} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    
                    {/* Heure d'arrivée */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Heure d'arrivée</span>
                      </div>
                      <div className="flex gap-2">
                        <Select value={arrivalHour} onValueChange={setArrivalHour}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hours.map(hour => <SelectItem key={hour} value={hour}>
                                {hour}h
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={arrivalMinute} onValueChange={setArrivalMinute}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {minutes.map(minute => <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Date de départ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de départ de la Réunion
                    </label>
                    <Popover open={showDeparturePicker} onOpenChange={setShowDeparturePicker}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !departureDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {departureDate ? format(departureDate, "PPP", {
                          locale: fr
                        }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={departureDate} onSelect={date => {
                        setDepartureDate(date);
                        setShowDeparturePicker(false);
                      }} disabled={date => date < (arrivalDate || new Date())} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    
                    {/* Heure de départ */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Heure de départ</span>
                      </div>
                      <div className="flex gap-2">
                        <Select value={departureHour} onValueChange={setDepartureHour}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hours.map(hour => <SelectItem key={hour} value={hour}>
                                {hour}h
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={departureMinute} onValueChange={setDepartureMinute}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {minutes.map(minute => <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {canPlanPurchase && <div className="border-t pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button className="bg-leaf-green hover:bg-dark-green text-white px-6 py-3" onClick={handleAirportPickup}>
                        <Plane className="mr-2 h-4 w-4" />
                        Récupérer à l'aéroport de Gillot
                      </Button>
                      <Button variant="outline" className="border-leaf-green text-leaf-green hover:bg-leaf-green/10 px-6 py-3" onClick={handlePlanPurchase}>Recevoir en Métropole</Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Séjour prévu du {format(arrivalDate!, "dd/MM", {
                    locale: fr
                  })} à {arrivalHour}h{arrivalMinute} au {format(departureDate!, "dd/MM/yyyy", {
                    locale: fr
                  })} à {departureHour}h{departureMinute}
                    </p>
                  </div>}
              </div>

              {/* Nouvelle phrase d'information importante */}
              <div className="max-w-2xl mx-auto mb-8">
                <p className="text-sm backdrop-blur-sm px-6 rounded-lg text-slate-50 py-[10px]">*Une commande de box à récupérer sur place à l'île de la Réunion ne peut se faire que 15 jours avant un vol aller ou retour. Dans le cas contraire, la livraison à votre adresse de résidence en Métropole vous sera proposée automatiquement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de sélection de date de récupération */}
      <Dialog open={showPickupDateModal} onOpenChange={setShowPickupDateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choisir la date de récupération</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              À quelle date souhaitez-vous récupérer votre box à l'aéroport de Gillot ?
            </p>
            
            <div className="space-y-3">
              <div 
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-colors",
                  selectedPickupDate === 'arrival' 
                    ? "border-leaf-green bg-leaf-green/5" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedPickupDate('arrival')}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    selectedPickupDate === 'arrival' 
                      ? "border-leaf-green bg-leaf-green" 
                      : "border-gray-300"
                  )} />
                  <div>
                    <p className="font-medium">Date d'arrivée</p>
                    <p className="text-sm text-gray-500">
                      {format(arrivalDate!, "PPPP", { locale: fr })} à {arrivalHour}h{arrivalMinute}
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-colors",
                  selectedPickupDate === 'departure' 
                    ? "border-leaf-green bg-leaf-green/5" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedPickupDate('departure')}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    selectedPickupDate === 'departure' 
                      ? "border-leaf-green bg-leaf-green" 
                      : "border-gray-300"
                  )} />
                  <div>
                    <p className="font-medium">Date de départ</p>
                    <p className="text-sm text-gray-500">
                      {format(departureDate!, "PPPP", { locale: fr })} à {departureHour}h{departureMinute}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPickupDateModal(false)}>
              Annuler
            </Button>
            <Button className="bg-leaf-green hover:bg-dark-green" onClick={handleConfirmPickup}>
              Confirmer et continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Hero;
