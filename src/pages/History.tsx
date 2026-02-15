import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Trash2, FileText, Camera, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getHistory, deleteTranslation, clearHistory, TranslationEntry } from '@/lib/storage';
import { getLanguageByCode } from '@/lib/languages';
import { useToast } from '@/hooks/use-toast';

const TYPE_ICONS = { text: FileText, image: Camera, voice: Mic };

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [history, setHistory] = useState<TranslationEntry[]>(getHistory);
  const [search, setSearch] = useState('');

  const filtered = history.filter(e =>
    e.originalText.toLowerCase().includes(search.toLowerCase()) ||
    e.translatedText.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteTranslation(id);
    setHistory(getHistory());
    toast({ title: 'Deleted' });
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    toast({ title: 'History cleared' });
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold flex-1 font-display">Saved Translations</h1>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-destructive text-xs">
            Clear All
          </Button>
        )}
      </div>

      {history.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search translations..."
            className="pl-9 h-12 rounded-xl bg-card"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="mt-4 font-medium font-display">No saved translations yet</p>
          <p className="text-sm mt-1">Your translations will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => {
            const Icon = TYPE_ICONS[entry.type];
            return (
              <Card key={entry.id} className="border-border/40 hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {getLanguageByCode(entry.sourceLang)?.name || entry.sourceLang} → {getLanguageByCode(entry.targetLang)?.name || entry.targetLang}
                        </span>
                        <span className="text-xs text-muted-foreground/60 ml-auto">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm truncate text-foreground">{entry.originalText}</p>
                      <p className="text-sm truncate text-primary font-medium mt-0.5">{entry.translatedText}</p>
                    </div>
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-4 w-4 text-destructive/60" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
