"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import loginSchema from "@/zodSchemas/loginSchema";
import signupSchema from "@/zodSchemas/signupSchema";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useAtom } from "jotai";
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
import { useState } from "react";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";

interface iFormProps {
  isLoginForm: boolean;
}

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

function AuthForm({ isLoginForm }: iFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formSchema = isLoginForm ? loginSchema : signupSchema;
  const defaultValuesToUse = isLoginForm
    ? { email: "", password: "" }
    : { email: "", password: "", confirmPassword: "" };
  const [formSubmissionError, setFormSubmissionError] = useState(null);
  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValuesToUse,
  });
  const [isLoginFormTemp, setIsLoginFormTemp] = useAtom(jotaiAtoms.isLoginForm);

  const onSubmit = async (data: LoginFormValues | SignupFormValues) => {
    setFormSubmissionError(null);
    const APIROUTE = isLoginForm ? "/api/login" : "/api/signup";
    try {
      setIsSubmitting(true);
      const response = await axios.post(APIROUTE, data);

      if (response.data.success === false) {
        setFormSubmissionError(response.data.message);
      }
      if (response.data.success && !isLoginForm) {
        setIsLoginFormTemp(true);
      }
      if (response.data.success && isLoginForm) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      !isLoginForm && form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formSubmissionError && (
          <div className="text-red-600 font-bold w-full flex justify-center items-center bg-slate-100 p-2 my-4 border border-red-600 rounded-lg shadow-md">
            {formSubmissionError}
          </div>
        )}
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
            {!isSubmitting ? (
              isLoginForm ? (
                "Login"
              ) : (
                "Signup"
              )
            ) : (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AuthForm;
