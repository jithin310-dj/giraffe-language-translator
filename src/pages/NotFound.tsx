import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import giraffeHero from '@/assets/giraffe-hero.png';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background giraffe-pattern">
      <div className="text-center px-6">
        <img src={giraffeHero} alt="Lost giraffe" className="h-24 w-24 mx-auto mb-4 opacity-60" />
        <h1 className="mb-2 text-5xl font-bold font-display text-foreground">404</h1>
        <p className="mb-4 text-lg text-muted-foreground">Oops! This page wandered off</p>
        <a href="/" className="text-accent font-semibold underline underline-offset-4 hover:text-accent/80 transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
