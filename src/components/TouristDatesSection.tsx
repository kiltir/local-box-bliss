import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plane, MapPin, Clock, Package, Truck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
const TouristDatesSection = () => {
  const { user } = useAuth();
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalHour, setArrivalHour] = useState<string>('12');
  const [arrivalMinute, setArrivalMinute] = useState<string>('00');
  const [departureHour, setDepartureHour] = useState<string>('14');
  const [departureMinute, setDepartureMinute] = useState<string>('00');
  const [deliveryPreference, setDeliveryPreference] = useState<string>('airport_pickup');
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTravelInfo = async () => {
    if (!arrivalDate || !departureDate) {
      toast.error("Veuillez sélectionner vos dates d'arrivée et de départ");
      return;
    }

    setSaving(true);
    try {
      const travelInfo = {
        arrival_date_reunion: arrivalDate.toISOString().split('T')[0],
        departure_date_reunion: departureDate.toISOString().split('T')[0],
        arrival_time_reunion: `${arrivalHour}:${arrivalMinute}:00`,
        departure_time_reunion: `${departureHour}:${departureMinute}:00`,
        delivery_preference: deliveryPreference,
      };
      
      localStorage.setItem('travelInfo', JSON.stringify(travelInfo));
      toast.success("Informations de voyage sauvegardées avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlanPurchase = () => {
    if (arrivalDate && departureDate) {
      // Logic for planning purchase - could scroll to boxes section or show a modal
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
  return <section className="bg-gradient-to-b from-white to-[#FEF7CD]/30 my-0 py-0">
      <div className="container-section mx-0 my-0 py-0">
        <div className="max-w-4xl mx-auto text-center py-[30px]">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-8 w-8 text-leaf-green mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Vous êtes en voyage à la Réunion ?</h2>
          </div>
          
          <p className="text-xl text-gray-600 mb-8">Planifiez vos achats selon vos dates de séjour. Achetez maintenant ou pour plus tard !</p>

          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
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

            {/* Options de livraison */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Mode de récupération souhaité
              </label>
              <RadioGroup value={deliveryPreference} onValueChange={setDeliveryPreference} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="airport_pickup" id="airport_pickup" />
                  <Label htmlFor="airport_pickup" className="flex items-center space-x-2 cursor-pointer flex-1">
                    <Package className="h-4 w-4 text-leaf-green" />
                    <span>Récupérer à l'aéroport Roland Garros</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="mainland_delivery" id="mainland_delivery" />
                  <Label htmlFor="mainland_delivery" className="flex items-center space-x-2 cursor-pointer flex-1">
                    <Truck className="h-4 w-4 text-leaf-green" />
                    <span>Recevoir en Métropole</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Boutons d'action */}
            <div className="border-t pt-6">
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={saveTravelInfo}
                  disabled={!arrivalDate || !departureDate || saving}
                  className="w-full bg-leaf-green hover:bg-dark-green text-white"
                >
                  {saving ? "Sauvegarde..." : "Sauvegarder mes informations de voyage"}
                </Button>
              </div>
            </div>

            {canPlanPurchase && <div className="border-t pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-leaf-green hover:bg-dark-green text-white px-6 py-3" onClick={handlePlanPurchase}>
                    <Plane className="mr-2 h-4 w-4" />
                    Acheter maintenant
                  </Button>
                  <Button variant="outline" className="border-leaf-green text-leaf-green hover:bg-leaf-green/10 px-6 py-3" onClick={handlePlanPurchase}>
                    Programmer pour le retour
                  </Button>
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
        </div>
      </div>
    </section>;
};
export default TouristDatesSection;