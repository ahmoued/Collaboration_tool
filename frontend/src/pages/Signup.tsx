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
  User,
  ArrowRight,
  Sparkles,
  FileText,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`http://backend:4000/auth/signup`, {
        username,
        email,
        password,
      });

      toast({
        title: "Account created!",
        description: "Welcome to FlowScribe. You can now sign in.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description:
          error.response?.data?.error ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-100 to-slate-200 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Signup Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1">
          <Card className="border-0 shadow-2xl shadow-purple-500/10 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-slate-800">
                Create your account
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Join thousands of users collaborating on FlowScribe
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-slate-700"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 border-border/50 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

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
                      className="pl-10 h-12 border-border/50 focus:border-primary transition-colors"
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
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-slate-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white/80"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">
                          Password strength:
                        </span>
                        <span
                          className={`font-medium ${
                            strength <= 2
                              ? "text-red-500"
                              : strength <= 3
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {getStrengthText(strength)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getStrengthColor(
                            strength
                          )}`}
                          style={{ width: `${(strength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-slate-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white/80"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="rounded border-slate-300/50 mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-slate-600 leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create account</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col space-y-4 text-center">
              <div className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Side - Features & Benefits */}
        <div className="hidden lg:block space-y-8 order-1 lg:order-2">
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
              Start collaborating in minutes, not hours
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-200/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Free to start</h3>
                <p className="text-slate-600">
                  Begin with our generous free plan, upgrade when you grow
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-200/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Instant setup</h3>
                <p className="text-slate-600">
                  No complex configuration - start writing immediately
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-200/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Rich editor</h3>
                <p className="text-slate-600">
                  Beautiful, distraction-free writing experience
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-slate-300/40 rounded-xl p-6 space-y-3">
            <h3 className="font-medium text-slate-800">
              What you get for free:
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Up to 5 documents</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Real-time collaboration</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Version history</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Cloud sync</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
