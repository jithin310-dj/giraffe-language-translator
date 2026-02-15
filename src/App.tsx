import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getPreferences } from "@/lib/storage";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import LanguageSelect from "./pages/LanguageSelect";
import Home from "./pages/Home";
import TextTranslate from "./pages/TextTranslate";
import ImageTranslate from "./pages/ImageTranslate";
import VoiceTranslate from "./pages/VoiceTranslate";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RootRedirect() {
  const prefs = getPreferences();
  if (prefs.hasCompletedOnboarding && prefs.preferredLanguage) {
    return <Navigate to="/home" replace />;
  }
  return <Navigate to="/welcome" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/language-select" element={<LanguageSelect />} />
          <Route path="/home" element={<Home />} />
          <Route path="/translate/text" element={<TextTranslate />} />
          <Route path="/translate/image" element={<ImageTranslate />} />
          <Route path="/translate/voice" element={<VoiceTranslate />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
