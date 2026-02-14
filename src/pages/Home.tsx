import { useNavigate } from 'react-router-dom';
import { FileText, Camera, Mic, BookOpen, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { getPreferences } from '@/lib/storage';
import { getLanguageByCode } from '@/lib/languages';

const ACTIONS = [
  { icon: FileText, label: 'Translate Text', path: '/translate/text', color: 'hsl(var(--primary))' },
  { icon: Camera, label: 'Scan Image', path: '/translate/image', color: 'hsl(var(--lingua-green))' },
  { icon: Mic, label: 'Speak & Translate', path: '/translate/voice', color: 'hsl(var(--accent))' },
  { icon: BookOpen, label: 'Saved Translations', path: '/history', color: 'hsl(var(--lingua-blue))' },
];

const Home = () => {
  const navigate = useNavigate();
  const prefs = getPreferences();
  const lang = getLanguageByCode(prefs.preferredLanguage);

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">LinguaLite</h1>
          <div className="flex items-center gap-2 mt-1">
            <ConnectionStatus />
            {lang && (
              <span className="text-xs text-muted-foreground">• {lang.nativeName}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <p className="text-muted-foreground mb-6 text-sm">What would you like to do?</p>

      <div className="grid grid-cols-2 gap-4">
        {ACTIONS.map(action => (
          <Card
            key={action.path}
            className="cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95 border-border/50"
            onClick={() => navigate(action.path)}
          >
            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon className="h-7 w-7" style={{ color: action.color }} />
              </div>
              <span className="font-semibold text-sm text-foreground leading-tight">{action.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
