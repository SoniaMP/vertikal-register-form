"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

type LoginState = { error: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/admin",
    });
    return { error: "" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos" };
    }
    // signIn throws a NEXT_REDIRECT on success — rethrow it
    throw error;
  }
}
