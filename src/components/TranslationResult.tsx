import { Volume2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getLanguageByCode } from '@/lib/languages';
import { TEXT_SIZE_CLASSES, UserPreferences } from '@/lib/storage';

interface TranslationResultProps {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  textSize: UserPreferences['textSize'];
  onSave?: () => void;
  saved?: boolean;
}

export function TranslationResult({
  originalText,
  translatedText,
  sourceLang,
  targetLang,
  textSize,
  onSave,
  saved,
}: TranslationResultProps) {
  const speak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  const sizeClass = TEXT_SIZE_CLASSES[textSize];

  return (
    <div className="space-y-3">
      <Card className="border-border/40 bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {getLanguageByCode(sourceLang)?.name || sourceLang}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => speak(originalText, sourceLang)}>
              <Volume2 className="h-4 w-4 text-primary" />
            </Button>
          </div>
          <p className={sizeClass}>{originalText}</p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {getLanguageByCode(targetLang)?.name || targetLang}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => speak(translatedText, targetLang)}>
                <Volume2 className="h-4 w-4 text-primary" />
              </Button>
              {onSave && (
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={onSave}>
                  <Bookmark className={`h-4 w-4 ${saved ? 'fill-primary text-primary' : 'text-primary'}`} />
                </Button>
              )}
            </div>
          </div>
          <p className={`${sizeClass} font-medium`}>{translatedText}</p>
        </CardContent>
      </Card>
    </div>
  );
}
