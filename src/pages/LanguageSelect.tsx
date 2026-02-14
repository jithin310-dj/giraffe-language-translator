import { useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { savePreferences } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const LANG_EMOJIS: Record<string, string> = {
  en: '🇬🇧', hi: '🇮🇳', te: '🇮🇳', ta: '🇮🇳', kn: '🇮🇳', ml: '🇮🇳',
};

const LanguageSelect = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');

  const handleContinue = () => {
    if (!selected) return;
    savePreferences({ preferredLanguage: selected, hasCompletedOnboarding: true });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8 flex flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Choose Your Language</h1>
        <p className="text-muted-foreground text-sm">Select the language you understand best</p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {SUPPORTED_LANGUAGES.map(lang => (
          <Card
            key={lang.code}
            className={`cursor-pointer transition-all duration-200 active:scale-95 ${
              selected === lang.code
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/30'
            }`}
            onClick={() => setSelected(lang.code)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center relative">
              {selected === lang.code && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              <span className="text-2xl mb-2">{LANG_EMOJIS[lang.code]}</span>
              <span className="font-bold text-foreground">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button
          onClick={handleContinue}
          disabled={!selected}
          size="lg"
          className="w-full h-14 text-lg font-bold rounded-2xl"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelect;
