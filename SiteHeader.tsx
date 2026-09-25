import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export function SiteHeader() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 rounded-md px-1 py-1"
        >
          <Logo />
          <span className="font-editor text-sm font-semibold tracking-tight">
            кодовая<span className="text-primary">база</span>
          </span>
        </button>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="font-editor text-xs"
                onClick={() => navigate("/dashboard")}
              >
                ~/курс
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-editor text-xs"
                onClick={handleSignOut}
              >
                <LogOut className="size-3.5" />
                Выйти
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="gap-1.5 font-editor text-xs"
              onClick={() => navigate("/auth?returnTo=%2Fdashboard")}
            >
              <LogIn className="size-3.5" />
              Начать бесплатно
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
