import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
// import { createUserAccount } from "@/lib/appwrite/api"
import { useToast } from "@/components/ui/use-toast";
import { useSignInUser } from "@/lib/react-query/query";

const Signin = () => {
  const { toast } = useToast();
  const Navigate = useNavigate();

  const { mutateAsync: signInUser, isPending: isSigningIn } = useSignInUser();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInValidation>) {
    const response = await signInUser({
      username: values.username,
      password: values.password,
    });

    if (response?.status == 400) {
      console.log(response.msg);
      return toast({ title: response.msg });
    }

    Navigate("/");
  }

  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/images/logo.svg" />
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Welcome Back</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            Enter Your Account Details
          </p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} />
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
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="shad-button_primary" type="submit">
              {isSigningIn ? (
                <div className="flex-center">
                  Loading... <Loader />
                </div>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-small-regular text-light-2 text-center">
              Don't have an Account?
              <Link
                to="/sign-up"
                className="text-primary-500 text-small-semibold ml-1"
              >
                {" "}
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </Form>
    </>
  );
};

export default Signin;
