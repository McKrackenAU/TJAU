import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Schema for admin account creation
const adminSchema = z.object({
  email: z.string().email("Email must be valid").refine(
    (email) => email === "jo@jmvirtualbusinessservices.com.au",
    { message: "Only the authorized email address can be used to create an admin account" }
  ),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  adminToken: z.string().min(1, "Admin token is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AdminFormValues = z.infer<typeof adminSchema>;

export default function CreateAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "jo@jmvirtualbusinessservices.com.au", // Prefilled and read-only
      username: "",
      password: "",
      confirmPassword: "",
      adminToken: "",
    },
  });

  async function onSubmit(data: AdminFormValues) {
    setIsSubmitting(true);
    try {
      const result = await apiRequest("POST", "/api/create-admin", data);
      const response = await result.json();

      if (result.ok) {
        setSuccess(true);
        toast({
          title: "Success!",
          description: "Admin account created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create admin account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>
            Create a special admin account for Jo@JMVirtualBusinessServices.com.au
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center p-4">
              <h3 className="text-xl font-bold text-green-600 mb-2">Admin Account Created!</h3>
              <p>The admin account has been successfully created and granted perpetual access.</p>
              <p className="mt-4">You can now log in with the credentials you provided.</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value="jo@jmvirtualbusinessservices.com.au" 
                          readOnly 
                          disabled 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                  control={form.control}
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

                <FormField
                  control={form.control}
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

                <FormField
                  control={form.control}
                  name="adminToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Token</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter the admin token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Admin Account...
                    </>
                  ) : "Create Admin Account"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}