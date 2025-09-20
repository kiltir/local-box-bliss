import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPin, Clock, X, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const Hero = () => {
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalHour, setArrivalHour] = useState<string>('12');
  const [arrivalMinute, setArrivalMinute] = useState<string>('00');
  const [departureHour, setDepartureHour] = useState<string>('14');
  const [departureMinute, setDepartureMinute] = useState<string>('00');
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [selectedPickupDate, setSelectedPickupDate] = useState<'arrival' | 'departure' | null>(null);

  const saveTravelInfoToLocalStorage = () => {
    if (!arrivalDate || !departureDate || !selectedPickupDate) {
      toast.error("Veuillez sélectionner vos dates et votre préférence de récupération");
      return;
    }

    const travelInfo = {
      arrival_date_reunion: arrivalDate.toISOString().split('T')[0],
      departure_date_reunion: departureDate.toISOString().split('T')[0],
      arrival_time_reunion: `${arrivalHour}:${arrivalMinute}:00`,
      departure_time_reunion: `${departureHour}:${departureMinute}:00`,
      delivery_preference: selectedPickupDate === 'arrival' ? 'airport_pickup_arrival' : 'airport_pickup_departure',
    };

    localStorage.setItem('travelInfo', JSON.stringify(travelInfo));
    toast.success("Dates de séjour enregistrées !");
  };

  const handleCommander = () => {
    saveTravelInfoToLocalStorage();
    document.getElementById('boxes')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleAnnuler = () => {
    setArrivalDate(undefined);
    setDepartureDate(undefined);
    setSelectedPickupDate(null);
    localStorage.removeItem('travelInfo');
    toast.info("Sélection de dates annulée");
  };

  const canProceed = arrivalDate && departureDate && selectedPickupDate;

  // Generate hours (00-23)
  const hours = Array.from({
    length: 24
  }, (_, i) => i.toString().padStart(2, '0'));

  // Generate minutes (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'];
  return <>
      <section style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/lovable-uploads/56c399f2-fc34-4f1d-befd-83ee8f0e5d2d.png')`
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
              
              <p className="text-xl text-white mb-8 font-normal">Vous pouvez renseigner vos dates de séjour <strong>15 jours</strong> avant un vol et profiter d'un service sur-mesure* ou recevoir votre commande en Métropole.</p>

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

                {/* Sélection de la date de récupération */}
                {arrivalDate && departureDate && (
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Quelle date souhaitez-vous pour récupérer votre commande à l'aéroport ?
                    </label>
                    <RadioGroup value={selectedPickupDate || ''} onValueChange={(value) => setSelectedPickupDate(value as 'arrival' | 'departure')} className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="arrival" id="pickup_arrival" />
                        <Label htmlFor="pickup_arrival" className="flex items-center space-x-2 cursor-pointer flex-1">
                          <span>Récupérer le {format(arrivalDate, "dd/MM/yyyy", { locale: fr })} à {arrivalHour}h{arrivalMinute} (arrivée)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="departure" id="pickup_departure" />
                        <Label htmlFor="pickup_departure" className="flex items-center space-x-2 cursor-pointer flex-1">
                          <span>Récupérer le {format(departureDate, "dd/MM/yyyy", { locale: fr })} à {departureHour}h{departureMinute} (départ)</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="border-t pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleCommander}
                      disabled={!canProceed}
                      className="bg-leaf-green hover:bg-dark-green text-white px-6 py-3"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Commander
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleAnnuler}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Annuler
                    </Button>
                  </div>
                  {!canProceed && (arrivalDate || departureDate) && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Veuillez sélectionner vos dates de séjour et votre préférence de récupération
                    </p>
                  )}
                </div>
              </div>

              {/* Nouvelle phrase d'information importante */}
              <div className="max-w-2xl mx-auto mb-8">
                <p className="text-sm backdrop-blur-sm px-6 rounded-lg text-slate-50 py-[10px]">*Une commande de box à récupérer sur place à l'aéroport de Roland Garros à la Réunion ne peut se faire que 15 jours avant un vol aller ou retour. Dans le cas contraire, une adresse de Métropole vous sera demandée pour la livraison.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>;
};
export default Hero;