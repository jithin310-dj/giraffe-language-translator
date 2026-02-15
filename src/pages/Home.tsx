import { useNavigate } from 'react-router-dom';
import { FileText, Camera, Mic, BookOpen, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { getPreferences } from '@/lib/storage';
import { getLanguageByCode } from '@/lib/languages';
import giraffeHero from '@/assets/giraffe-hero.png';

const ACTIONS = [
  { icon: FileText, label: 'Translate Text', desc: 'Type or paste', path: '/translate/text', colorVar: '--giraffe-teal' },
  { icon: Camera, label: 'Scan Image', desc: 'Photo to text', path: '/translate/image', colorVar: '--giraffe-sky' },
  { icon: Mic, label: 'Speak & Translate', desc: 'Voice input', path: '/translate/voice', colorVar: '--giraffe-spot' },
  { icon: BookOpen, label: 'Saved Translations', desc: 'Your history', path: '/history', colorVar: '--primary' },
];

const Home = () => {
  const navigate = useNavigate();
  const prefs = getPreferences();
  const lang = getLanguageByCode(prefs.preferredLanguage);

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={giraffeHero} alt="LinguaLite" className="h-10 w-10 rounded-xl" />
          <div>
            <h1 className="text-xl font-bold text-foreground font-display">LinguaLite</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <ConnectionStatus />
              {lang && (
                <span className="text-xs text-muted-foreground">• {lang.nativeName}</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Greeting card */}
      <Card className="mb-6 border-0 bg-primary/5 shadow-none">
        <CardContent className="p-4">
          <p className="text-sm text-primary font-semibold">👋 What would you like to do today?</p>
          <p className="text-xs text-muted-foreground mt-1">Choose an option below to get started</p>
        </CardContent>
      </Card>

      {/* Action grid */}
      <div className="grid grid-cols-2 gap-4">
        {ACTIONS.map(action => (
          <Card
            key={action.path}
            className="cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.97] border-border/40 hover:border-primary/30"
            onClick={() => navigate(action.path)}
          >
            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `hsl(var(${action.colorVar}) / 0.12)` }}
              >
                <action.icon className="h-7 w-7" style={{ color: `hsl(var(${action.colorVar}))` }} />
              </div>
              <div>
                <span className="font-semibold text-sm text-foreground leading-tight block">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
