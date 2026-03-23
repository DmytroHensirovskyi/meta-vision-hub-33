import { useState } from "react";
import { KeyRound, Loader2, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface AuthScreenProps {
  onConnect: (token: string) => void;
}

const AuthScreen = ({ onConnect }: AuthScreenProps) => {
  const { t } = useLanguage();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError(t("auth_error_empty"));
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    localStorage.setItem("metaapi_token", token.trim());
    setLoading(false);
    onConnect(token.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Language switcher — top right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="relative w-full max-w-sm mx-4 animate-slide-up">
        {/* Logo & brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-border mb-4">
            <Zap className="w-5 h-5 text-accent-blue" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Analytica
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("auth_subtitle")}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="mb-5">
            <h2 className="text-sm font-medium text-foreground">
              {t("auth_connect_title")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {t("auth_connect_desc")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="token"
                className="block text-xs font-medium text-muted-foreground mb-1.5"
              >
                {t("auth_token_label")}
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
                  strokeWidth={1.5}
                />
                <input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="
                    w-full h-9 pl-8 pr-3 text-sm rounded-md
                    bg-background border border-border
                    text-foreground placeholder:text-muted-foreground/50
                    focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue
                    transition-colors
                  "
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-9 flex items-center justify-center gap-2
                rounded-md text-sm font-medium
                bg-accent-blue text-background
                hover:opacity-90 active:opacity-80
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-opacity
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t("auth_connecting")}
                </>
              ) : (
                t("auth_connect_btn")
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          {t("auth_no_token")}
        </p>
        <button
          onClick={() => {
            localStorage.setItem("metaapi_token", "demo");
            onConnect("demo");
          }}
          className="mt-1 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          {t("auth_demo")}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
