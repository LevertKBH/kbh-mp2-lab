"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export type CreateUserBody = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export async function signIn(email: string, password: string) {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to sign in");
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to sign up");
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to sign out");
  }
}
