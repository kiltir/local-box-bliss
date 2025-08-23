
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import BoxManagement3D from "./pages/BoxManagement3D";
import NotreHistoire from "./pages/NotreHistoire";
import NousContacter from "./pages/NousContacter";
import FAQ from "./pages/FAQ";
import ConditionsGenerales from "./pages/ConditionsGenerales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import NosEngagements from "./pages/NosEngagements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/box-management" element={<BoxManagement3D />} />
          <Route path="/notre-histoire" element={<NotreHistoire />} />
          <Route path="/nous-contacter" element={<NousContacter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/conditions-generales" element={<ConditionsGenerales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/nos-engagements" element={<NosEngagements />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
