"use client";

import { useState, useTransition } from "react";
import {
  startAuthentication,
} from "@simplewebauthn/browser";
import {
  finishPasskeyLogin,
  startPasskeyLogin,
} from "./functions";
import { Button } from "@/app/components/ui/button";
import { AuthLayout } from "@/app/layouts/AuthLayout";

export function Login() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const passkeyLogin = async () => {
    // 1. Get a challenge from the worker
    const options = await startPasskeyLogin();

    // 2. Ask the browser to sign the challenge
    const login = await startAuthentication({ optionsJSON: options });

    // 3. Give the signed challenge to the worker to finish the login process
    const success = await finishPasskeyLogin(login);

    if (!success) {
      setResult("Login failed");
    } else {
      setResult("Login successful!");
    }
  };

  const handlePerformPasskeyLogin = () => {
    startTransition(() => void passkeyLogin());
  };

  return (
    <AuthLayout>
      <div className="absolute top-0 right-0 p-10">
        <a href="/user/signup" className="font-display font-bold text-black text-sm underline-offset-8 hover:decoration-primary">
          Register
        </a>
      </div>
      <div className="max-w-[400px] w-full mx-auto px-10">
        <h1 className="text-center">Login</h1>
        <p className="py-6">Enter your username below to sign-in.</p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <Button onClick={handlePerformPasskeyLogin} disabled={isPending}>
          {isPending ? "..." : "Login with passkey"}
        </Button>
        {result && <div>{result}</div>}
        <p>By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
      </div>
    </AuthLayout>
  );
}
