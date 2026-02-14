import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[hsl(var(--lingua-cream))] to-[hsl(var(--lingua-warm-white))] px-6">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <Globe className="h-12 w-12 text-primary" />
        </div>

        <h1 className="mb-3 text-4xl font-extrabold text-foreground tracking-tight">
          LinguaLite
        </h1>

        <p className="mb-2 text-lg text-muted-foreground font-medium">
          Understand anything, in your language
        </p>

        <p className="mb-10 text-sm text-muted-foreground/70">
          Simple translations for everyone — works even without internet
        </p>

        <Button
          onClick={() => navigate('/language-select')}
          size="lg"
          className="w-full max-w-xs h-14 text-lg font-bold rounded-2xl shadow-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
