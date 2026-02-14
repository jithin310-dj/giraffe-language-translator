import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TranslationResult } from '@/components/TranslationResult';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { getPreferences, saveTranslation } from '@/lib/storage';
import { usePreferences } from '@/hooks/usePreferences';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ImageTranslate = () => {
  const navigate = useNavigate();
  const { prefs } = usePreferences();
  const isOnline = useOnlineStatus();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [targetLang, setTargetLang] = useState(prefs.preferredLanguage || 'hi');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImagePreview(ev.target?.result as string);
      setExtractedText('');
      setTranslatedText('');
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!imagePreview) return;
    if (!isOnline) {
      toast({ title: 'You are offline', description: 'Image scanning requires internet.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { image: imagePreview, targetLang, mode: 'ocr' },
      });
      if (error) throw error;
      setExtractedText(data.extractedText || '');
      setTranslatedText(data.translatedText || '');
    } catch (err: any) {
      toast({ title: 'Scan failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    saveTranslation({ originalText: extractedText, translatedText, sourceLang: 'auto', targetLang, type: 'image' });
    setSaved(true);
    toast({ title: 'Saved!' });
  };

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">Scan Image</h1>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-muted-foreground mb-1 block">Translate to</label>
        <Select value={targetLang} onValueChange={setTargetLang}>
          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map(l => (
              <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />

      {imagePreview ? (
        <div className="mb-4 rounded-xl overflow-hidden border border-border">
          <img src={imagePreview} alt="Captured" className="w-full max-h-64 object-contain bg-muted" />
        </div>
      ) : (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-28 rounded-xl flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-sm font-semibold">Take Photo</span>
          </Button>
          <Button
            variant="outline"
            className="h-28 rounded-xl flex-col gap-2"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute('capture');
                fileInputRef.current.click();
                fileInputRef.current.setAttribute('capture', 'environment');
              }
            }}
          >
            <ImageIcon className="h-8 w-8 text-[hsl(var(--lingua-green))]" />
            <span className="text-sm font-semibold">From Gallery</span>
          </Button>
        </div>
      )}

      {imagePreview && (
        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => { setImagePreview(null); setExtractedText(''); setTranslatedText(''); }}>
            Retake
          </Button>
          <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleScan} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Scan & Translate'}
          </Button>
        </div>
      )}

      {translatedText && (
        <TranslationResult
          originalText={extractedText}
          translatedText={translatedText}
          sourceLang="auto"
          targetLang={targetLang}
          textSize={prefs.textSize}
          onSave={handleSave}
          saved={saved}
        />
      )}
    </div>
  );
};

export default ImageTranslate;
