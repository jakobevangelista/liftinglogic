"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    api.createClient({
      // transformer: transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer,
          url: getUrl(),
          // headers() {
          //   return {
          //     cookie: props.cookies,
          //     "x-trpc-source": "react",
          //   };
          // },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
// "use client";

// import { httpBatchLink } from '@trpc/client';
// import { createTRPCNext } from '@trpc/next';
// import { ssrPrepass } from '@trpc/next/ssrPrepass';
// import superjson from 'superjson';
// // import type { AppRouter } from './api/trpc/[trpc]';
// export const trpc = createTRPCNext<AppRouter>({
//   ssr: true,
//   ssrPrepass,
//   config(opts) {
//     const { ctx } = opts;
//     if (typeof window !== 'undefined') {
//       // during client requests
//       return {
//         links: [
//           httpBatchLink({
//             url: '/api/trpc',
//           }),
//         ],
//       };
//     }
//     return {
//       links: [
//         httpBatchLink({
//           // The server needs to know your app's full url
//           url: `${getUrl()}/api/trpc`,
//           /**
//            * Set custom request headers on every request from tRPC
//            * @link https://trpc.io/docs/v10/header
//            */
//           headers() {
//             if (!ctx?.req?.headers) {
//               return {};
//             }
//             // To use SSR properly, you need to forward client headers to the server
//             // This is so you can pass through things like cookies when we're server-side rendering
//             return {
//               cookie: ctx.req.headers.cookie,
//             };
//           },
//         }),
//       ],
//     };
//   },
// });
