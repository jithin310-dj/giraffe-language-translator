import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TranslationResult } from '@/components/TranslationResult';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { saveTranslation } from '@/lib/storage';
import { usePreferences } from '@/hooks/usePreferences';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VoiceTranslate = () => {
  const navigate = useNavigate();
  const { prefs } = usePreferences();
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState(prefs.preferredLanguage || 'hi');
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: 'Not supported', description: 'Speech recognition is not available on this device.', variant: 'destructive' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      setIsListening(false);
      handleTranslate(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({ title: 'Could not hear you', description: 'Please try again.', variant: 'destructive' });
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranslatedText('');
    setSaved(false);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleTranslate = async (text: string) => {
    if (!text.trim() || !isOnline) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text, sourceLang, targetLang, mode: 'text' },
      });
      if (error) throw error;
      setTranslatedText(data.translatedText);
    } catch (err: any) {
      toast({ title: 'Translation failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    saveTranslation({ originalText: spokenText, translatedText, sourceLang, targetLang, type: 'voice' });
    setSaved(true);
    toast({ title: 'Saved!' });
  };

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold font-display">Speak & Translate</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Select value={sourceLang} onValueChange={setSourceLang}>
          <SelectTrigger className="flex-1 h-12 rounded-xl bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map(l => (
              <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm font-bold">→</span>
        <Select value={targetLang} onValueChange={setTargetLang}>
          <SelectTrigger className="flex-1 h-12 rounded-xl bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map(l => (
              <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col items-center mb-8">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`h-28 w-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isListening
              ? 'bg-destructive animate-pulse shadow-destructive/30'
              : 'bg-accent shadow-accent/30 active:scale-95 hover:shadow-xl'
          }`}
        >
          {isListening ? (
            <MicOff className="h-10 w-10 text-destructive-foreground" />
          ) : (
            <Mic className="h-10 w-10 text-accent-foreground" />
          )}
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          {isListening ? 'Listening... tap to stop' : 'Tap to start speaking'}
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center mb-6">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      )}

      {spokenText && (
        <div className="mb-4 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground border border-border/40">
          <span className="font-semibold text-foreground">You said:</span> {spokenText}
        </div>
      )}

      {translatedText && (
        <TranslationResult
          originalText={spokenText}
          translatedText={translatedText}
          sourceLang={sourceLang}
          targetLang={targetLang}
          textSize={prefs.textSize}
          onSave={handleSave}
          saved={saved}
        />
      )}
    </div>
  );
};

export default VoiceTranslate;
