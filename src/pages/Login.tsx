import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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

import { Workflow, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

/* ============================================================
   LOGIN PAGE – FINAL JWT VERSION
   ============================================================ */

export default function Login() {
  /* ------------------------------------------------------------
     HOOKS
     ------------------------------------------------------------ */

  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuth();

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------
     AUTO REDIRECT IF ALREADY LOGGED IN
     ------------------------------------------------------------ */

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  /* ------------------------------------------------------------
     ROLE BASED REDIRECT
     ------------------------------------------------------------ */

  const redirectByRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        navigate("/dashboard", { replace: true });
        break;

      case "EMPLOYEE":
        navigate("/dashboard", { replace: true });
        break;

      default:
        navigate("/dashboard", { replace: true });
    }
  };

  /* ------------------------------------------------------------
     SUBMIT HANDLER
     ------------------------------------------------------------ */

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      await login(email, password);

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        redirectByRole(parsed.role);
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("[Login] Sign in failed", err);
      setError("Invalid email or password");
    }
  };

  /* ------------------------------------------------------------
     RENDER
     ------------------------------------------------------------ */

  return (
    <div className="min-h-screen flex">
      {/* ======================================================
         LEFT SIDE – BRANDING
         ====================================================== */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Back link */}
          <Link
            to="/"
            className="flex items-center gap-3 text-foreground hover:opacity-80"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>

          {/* Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Workflow className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">WorkflowPro</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Streamline your <br />
              <span className="text-gradient">workflow approvals</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Securely manage internal requests, approvals, and workflows with
              role-based access and real-time tracking.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div>
              <p className="text-2xl font-bold text-foreground">10k+</p>
              <p>Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">500+</p>
              <p>Companies</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">99.9%</p>
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
         RIGHT SIDE – LOGIN FORM
         ====================================================== */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-lg">
          <CardHeader className="space-y-1 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Workflow className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">WorkflowPro</span>
            </div>

            <CardTitle className="text-2xl font-bold">
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSignIn}>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-destructive font-medium">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to="/"
                  className="text-primary font-medium hover:underline"
                >
                  Contact sales
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
