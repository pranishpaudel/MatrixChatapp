"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import loginSchema from "@/zodSchemas/loginSchema";
import signupSchema from "@/zodSchemas/signupSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

interface iFormProps {
  isLoginForm: boolean;
}

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export function LoginForm({ isLoginForm }: iFormProps) {
  const formSchema = isLoginForm ? loginSchema : signupSchema;
  const defaultValuesToUse = isLoginForm
    ? { email: "", password: "" }
    : { email: "", password: "", confirmPassword: "" };

  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValuesToUse,
  });

  const onSubmit = (data: LoginFormValues | SignupFormValues) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="w-full h-[55px] rounded-2xl"
                />
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
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  className="w-full h-[55px] rounded-2xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isLoginForm && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your password again"
                    {...field}
                    className="w-full h-[55px] rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-center mt-28">
          <Button type="submit" className="w-60 rounded-2xl">
            {isLoginForm ? "Login" : "Signup"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
