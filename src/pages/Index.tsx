import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { UserDashboard } from "@/components/users/UserDashboard";

type AuthMode = "login" | "signup";
type AppState = "auth" | "dashboard";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("auth");
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const handleLoginSuccess = () => {
    setAppState("dashboard");
  };

  const handleSignupSuccess = () => {
    setAppState("dashboard");
  };

  const handleLogout = () => {
    setAppState("auth");
    setAuthMode("login");
  };

  if (appState === "dashboard") {
    return <UserDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authMode === "login" ? (
          <LoginForm
            onSwitchToSignup={() => setAuthMode("signup")}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setAuthMode("login")}
            onSignupSuccess={handleSignupSuccess}
          />
        )}
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default Index;