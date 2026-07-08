import Link from "next/link";

import { Globe, Lock, Server, ShieldCheck } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "../_components/login-form";

export default function Login() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Login to your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to login.</p>
        </div>
        <div className="space-y-4">
          <LoginForm />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-muted-foreground text-xs">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden="true" /> SOC 2 Type II
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Server className="size-3.5" aria-hidden="true" /> Self-hosted
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5" aria-hidden="true" /> Encrypted
          </span>
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link prefetch={false} className="text-foreground" href="/signup">
            Sign up
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="size-4 text-muted-foreground" />
          ENG
        </div>
      </div>
    </>
  );
}
