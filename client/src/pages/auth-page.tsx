import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth, LoginData, RegisterData } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import TermsDialog from "@/components/terms-dialog";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

// Reset password form schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Setup login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Setup registration form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Setup forgot password form
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  // Handle registration form submission
  const onRegisterSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  // Handle forgot password form submission
  const onForgotPasswordSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setForgotPasswordSent(true);
      } else {
        const error = await response.json();
        console.error('Forgot password error:', error);
      }
    } catch (error) {
      console.error('Forgot password request failed:', error);
    }
  };
  
  // Use useEffect for redirection when user is logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  
  // Show loading state if user is already authenticated
  if (user || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Form Section */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          <h2 className="text-3xl font-bold text-primary mb-2">Tarot Journey</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot-password">Reset</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Account Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging In...
                          </>
                        ) : "Sign In"}
                      </Button>
                      
                      <div className="text-center mt-4">
                        <Button 
                          variant="link" 
                          className="text-sm text-muted-foreground hover:text-primary"
                          type="button"
                          onClick={() => setActiveTab("forgot-password")}
                        >
                          Forgot your password?
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <div className="flex justify-center p-4 border-t">
                  <TermsDialog />
                </div>
              </Card>
            </TabsContent>

            {/* Registration Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Register for a new account to start your tarot journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormDescription>
                              At least 8 characters with uppercase, lowercase and a number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <div className="flex justify-center p-4 border-t">
                  <TermsDialog />
                </div>
              </Card>
            </TabsContent>

            {/* Forgot Password Form */}
            <TabsContent value="forgot-password">
              <Card>
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email address and we'll send you a reset link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {forgotPasswordSent ? (
                    <div className="text-center space-y-4">
                      <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-green-600">✓</span>
                      </div>
                      <h3 className="text-lg font-semibold">Check your email</h3>
                      <p className="text-muted-foreground">
                        If an account with that email exists, we've sent you a password reset link.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setActiveTab("login");
                          setForgotPasswordSent(false);
                          forgotPasswordForm.reset();
                        }}
                      >
                        Back to Login
                      </Button>
                    </div>
                  ) : (
                    <Form {...forgotPasswordForm}>
                      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={forgotPasswordForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full">
                          Send Reset Link
                        </Button>
                        
                        <div className="text-center">
                          <Button 
                            variant="link" 
                            className="text-sm text-muted-foreground hover:text-primary"
                            type="button"
                            onClick={() => setActiveTab("login")}
                          >
                            Back to Login
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center text-center p-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-6">Begin Your Tarot Journey</h1>
          <p className="text-lg mb-8">
            Explore the mysteries of tarot with personalized readings, 
            AI-powered interpretations, and a comprehensive learning system.
            Track your progress and deepen your understanding of the cards.
          </p>
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold">AI Interpretations</h3>
                <p>Get personalized card readings with advanced AI assistance</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold">Learning System</h3>
                <p>Master tarot with our spaced repetition learning system</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold">Journal & Progress</h3>
                <p>Track your readings and spiritual journey over time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}