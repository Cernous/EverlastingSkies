import { ChakraProvider } from "@chakra-ui/react";

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RouterProvider, createRouter} from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import theme from './theme';
import { OpenAPI } from "./client";

OpenAPI.BASE = import.meta.env.VITE_API_URL

const queryClient = new QueryClient()
                                
const router = createRouter({ 
  routeTree, 
});

declare module '@tanstack/react-router'{
  interface Register {
    router: typeof router
  }
};

const root = ReactDOM.createRoot(document.getElementById('App')!);

root.render(
  <StrictMode>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
        </QueryClientProvider>
      </ChakraProvider>
  </StrictMode>
);
