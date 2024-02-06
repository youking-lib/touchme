"use client";

import * as React from "react";

import { cn } from "@repo/utils/libs";
import { Icon, Button, Input, Label } from "@repo/ui";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [codeInputOpen, setIsCodeInputOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");

  async function onRequestEmailSignIn() {
    setIsLoading(true);

    await fetch("/api/login/email-verify", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });

    setIsCodeInputOpen(true);
    setIsLoading(false);
  }

  async function onVerifyCode() {
    setIsLoading(true);

    await fetch("/api/login/email-signin", {
      method: "POST",
      body: JSON.stringify({
        email,
        code,
      }),
    });

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        onSubmit={event => {
          event.preventDefault();

          if (!codeInputOpen) {
            onRequestEmailSignIn();
          } else {
            onVerifyCode();
          }
        }}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
          </div>
          {codeInputOpen && (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="code">
                Password
              </Label>
              <Input
                id="code"
                placeholder="Please check your email and enter the code"
                type="text"
                disabled={isLoading}
                onChange={e => {
                  setCode(e.target.value);
                }}
              />
            </div>
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin">
                <Icon name="Loader" />
              </span>
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin">
            <Icon name="Loader" />
          </span>
        ) : (
          <span className="mr-2 h-4 w-4">
            <Icon name="Github" />
          </span>
        )}{" "}
        GitHub
      </Button>
    </div>
  );
}
