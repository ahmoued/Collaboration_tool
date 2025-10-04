import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  FileText,
  Users,
  Zap,
} from "lucide-react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://process.env.REACT_APP_BACKEND_HOST:4000/auth/login", {
        email,
        password,
      });

      // Store the JWT token
      localStorage.setItem("token", response.data.token);

      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description:
          error.response?.data?.error ||
          "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-100 to-slate-200 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FlowScribe
              </h1>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed">
              The most intuitive collaborative document editor for modern teams
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-200/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">
                  Real-time Collaboration
                </h3>
                <p className="text-slate-600">
                  Work together seamlessly with your team in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-pink-200/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">
                  Smart Permissions
                </h3>
                <p className="text-slate-600">
                  Control access with granular permission settings
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-200/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Lightning Fast</h3>
                <p className="text-slate-600">
                  Experience blazing fast document loading and editing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="border-0 shadow-2xl shadow-purple-500/10 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-slate-800">
                Welcome back
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-slate-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white/80"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-slate-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white/80"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300/50"
                    />
                    <span className="text-slate-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign in</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/90 px-2 text-slate-500">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-slate-300/50 hover:bg-slate-100/50 transition-colors bg-white/80"
                onClick={() => {
                  // Demo login
                  setEmail("demo@example.com");
                  setPassword("demo123");
                }}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Try Demo Account</span>
                </div>
              </Button>
            </CardContent>

            <CardFooter className="flex-col space-y-4 text-center">
              <div className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  Sign up for free
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
