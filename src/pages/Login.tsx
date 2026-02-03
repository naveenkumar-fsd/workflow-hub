import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'employee', label: 'Employee', description: 'Submit and track your requests' },
  { value: 'manager', label: 'Manager', description: 'Approve team requests' },
  { value: 'hr', label: 'HR', description: 'Manage HR workflows' },
  { value: 'admin', label: 'Admin', description: 'Full system access' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('demo@workflowpro.com');
  const [password, setPassword] = useState('demo123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [showPassword, setShowPassword] = useState(false);

  //modify
  const handleSubmit = async () => {
  console.log("STEP 1: SIGN IN CLICKED");

  await login(email, password, selectedRole);
  navigate("/dashboard");
};



  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3 text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Workflow className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">WorkflowPro</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Streamline your<br />
              <span className="text-gradient">workflow approvals</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Join thousands of companies that trust WorkflowPro to manage their internal requests and approvals efficiently.
            </p>
          </div>

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

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-lg">
          <CardHeader className="space-y-1 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Workflow className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">WorkflowPro</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">

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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Role Selection (Demo) */}
              <div className="space-y-2">
                <Label>Login as (Demo)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all duration-200',
                        selectedRole === role.value
                          ? 'border-primary bg-accent ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      )}
                    >
                      <p className="text-sm font-medium">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
  type="button"
  className="w-full"
  size="lg"
  disabled={isLoading}
  onClick={handleSubmit}
>

                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/" className="text-primary font-medium hover:underline">
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
