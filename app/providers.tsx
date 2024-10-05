"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </RecoilRoot>
  );
}
