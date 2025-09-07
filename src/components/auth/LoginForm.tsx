import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import "./loginform.css";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: (userData?: any) => void; // pass user data when login success
}

const LoginFormUI = ({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchToSignup,
}: {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToSignup: () => void;
}) => {
  return (
    <div className="login-form-container">
      <img src="/robot-peek.png" alt="Robot mascot" className="login-robot" />

      <Card className="login-card">
        <CardHeader className="login-card-header">
          <CardTitle className="login-card-title">Welcome Back</CardTitle>
          <CardDescription className="login-card-description">
            Sign in to your{" "}
            <span style={{ color: "#06b6d4" }}>SMARTHub</span> account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-gray-300 font-medium"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-gray-300 font-medium"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <Button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="login-signup-text mt-6">
            <p className="text-sm">
              Don't have an account?{" "}
              <button onClick={onSwitchToSignup}>Sign up</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const LoginForm = ({
  onSwitchToSignup,
  onLoginSuccess,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost/RETSEJ_UI-MAIN/backend/LoginForm.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast({
          title: "Login successful!",
          description: `Welcome back, ${data.user.name}`,
        });
        onLoginSuccess(data.user); // pass user data
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginFormUI
      email={email}
      password={password}
      isLoading={isLoading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onSwitchToSignup={onSwitchToSignup}
    />
  );
};
