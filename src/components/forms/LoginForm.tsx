"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { loginUser, recaptchaTokenVerify } from "@/services/auth/auth.service";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { signIn } from "next-auth/react";
// import { baseUrl } from "@/utils/authOptions";
// import ShimmerButton from "../shared/ShimmerButton";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirectPath");
  const router = useRouter();

  const [recaptchaStatus, setRecaptchaStatus] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    formState: { isSubmitting },
  } = useForm();

  const handleRecaptchaChange = async (value: string | null) => {
    try {
      const res = await recaptchaTokenVerify(value as string);
      setRecaptchaStatus(res?.success);
    } catch (err: any) {
      console.error(err);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("logging in...");
    try {
      const res = await loginUser(values);
      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  {...field}
                  value={field.value || ""}
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          onChange={handleRecaptchaChange}
          className="w-full flex justify-center items-center"
        />

        <Button disabled={!recaptchaStatus}>
          {isSubmitting ? "Logging..." : "Login"}
        </Button>
      </form>

      {/* social login  */}
      <div>
        {/* <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-3">
          Or login using your social account
        </p> */}
        <div className="flex justify-center gap-4 mt-4">
          {/* goggle login  */}
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            <Image
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
              width={30}
              height={30}
              alt="Google logo"
              onClick={() =>
                signIn("google", {
                  callbackUrl: `${baseUrl}/dashboard`,
                })
              }
            />
          </motion.button> */}

          {/* github login  */}
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            onClick={() =>
              signIn("github", {
                callbackUrl: `${baseUrl}/dashboard`,
              })
            }
          >
            <Image
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              width={25}
              height={25}
              alt="GitHub logo"
            />
          </motion.button> */}
        </div>
      </div>
    </Form>
  );
}
