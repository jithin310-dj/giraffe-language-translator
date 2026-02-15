import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import giraffeHero from '@/assets/giraffe-hero.png';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center giraffe-gradient giraffe-pattern px-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
      <div className="absolute bottom-20 left-5 w-40 h-40 rounded-full bg-secondary/30 blur-3xl" />

      <div className="flex flex-col items-center text-center max-w-sm relative z-10">
        <div className="mb-6 animate-float">
          <img
            src={giraffeHero}
            alt="LinguaLite Giraffe mascot"
            className="h-36 w-36 drop-shadow-lg"
          />
        </div>

        <h1 className="mb-2 text-4xl font-bold text-foreground tracking-tight font-display">
          LinguaLite
        </h1>
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
          Giraffe Language Translator
        </p>

        <p className="mb-2 text-lg text-muted-foreground font-medium">
          Understand Any Language. Anywhere.
        </p>

        <p className="mb-10 text-sm text-muted-foreground/70">
          Simple, inclusive translations for everyone — works even offline
        </p>

        <div className="w-full space-y-3 max-w-xs">
          <Button
            onClick={() => navigate('/language-select')}
            size="lg"
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Start Translating
          </Button>
          <Button
            onClick={() => navigate('/language-select')}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg font-bold rounded-2xl border-2 border-primary/20 hover:bg-primary/5"
          >
            Login / Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
