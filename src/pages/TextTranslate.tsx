import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TranslationResult } from '@/components/TranslationResult';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { getPreferences, saveTranslation } from '@/lib/storage';
import { usePreferences } from '@/hooks/usePreferences';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TextTranslate = () => {
  const navigate = useNavigate();
  const { prefs } = usePreferences();
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState(prefs.preferredLanguage || 'hi');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    if (!isOnline) {
      toast({ title: 'You are offline', description: 'Translation requires an internet connection.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setSaved(false);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text: inputText, sourceLang, targetLang, mode: 'text' },
      });
      if (error) throw error;
      setTranslatedText(data.translatedText);
    } catch (err: any) {
      toast({ title: 'Translation failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    saveTranslation({ originalText: inputText, translatedText, sourceLang, targetLang, type: 'text' });
    setSaved(true);
    toast({ title: 'Saved!', description: 'Translation saved to your history.' });
  };

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">Translate Text</h1>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Select value={sourceLang} onValueChange={setSourceLang}>
          <SelectTrigger className="flex-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map(l => (
              <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={swapLanguages} className="shrink-0">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <Select value={targetLang} onValueChange={setTargetLang}>
          <SelectTrigger className="flex-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map(l => (
              <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder="Type or paste text here..."
        className="min-h-[140px] rounded-xl text-base mb-4 resize-none"
      />

      <Button
        onClick={handleTranslate}
        disabled={!inputText.trim() || isLoading}
        className="w-full h-12 rounded-xl text-base font-bold mb-6"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Translate'}
      </Button>

      {translatedText && (
        <TranslationResult
          originalText={inputText}
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

export default TextTranslate;
