import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Type, Database, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { usePreferences } from '@/hooks/usePreferences';
import { clearHistory, getStorageSize, UserPreferences } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const TEXT_SIZES: { value: UserPreferences['textSize']; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'extra-large', label: 'Extra Large' },
];

const Settings = () => {
  const navigate = useNavigate();
  const { prefs, updatePreferences } = usePreferences();
  const { toast } = useToast();
  const [storageSize] = useState(getStorageSize);

  const handleClearCache = () => {
    clearHistory();
    toast({ title: 'Cache cleared', description: 'All saved translations have been removed.' });
  };

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold font-display">Settings</h1>
      </div>

      <div className="space-y-4">
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Preferred Language</span>
            </div>
            <Select value={prefs.preferredLanguage} onValueChange={v => updatePreferences({ preferredLanguage: v })}>
              <SelectTrigger className="h-12 rounded-xl bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(l => (
                  <SelectItem key={l.code} value={l.code}>{l.nativeName} ({l.name})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Type className="h-4 w-4 text-accent" />
              </div>
              <span className="font-semibold">Text Size</span>
            </div>
            <Select value={prefs.textSize} onValueChange={(v: UserPreferences['textSize']) => updatePreferences({ textSize: v })}>
              <SelectTrigger className="h-12 rounded-xl bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TEXT_SIZES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <Database className="h-4 w-4 text-secondary-foreground" />
              </div>
              <span className="font-semibold">Offline Data</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Storage used: {storageSize}</p>
            <Button variant="outline" className="w-full rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5" onClick={handleClearCache}>
              Clear Saved Translations
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-semibold">About</span>
            </div>
            <p className="text-sm text-muted-foreground">LinguaLite v1.0.0</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Giraffe Language Translator — Understand Any Language. Anywhere.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
