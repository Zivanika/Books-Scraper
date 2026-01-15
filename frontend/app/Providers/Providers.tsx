"use client";
import React from "react";
import { BookProvider } from "../context/BookContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <BookProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BookProvider>
  );
}

export default Providers;
