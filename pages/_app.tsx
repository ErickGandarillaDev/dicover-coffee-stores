import { createContext, Dispatch, Reducer, useReducer } from 'react';
import '../styles/globals.css'
import StoreProvider from '../store/store-context';
import type { AppProps } from 'next/app'




function MyApp({ Component, pageProps }: AppProps) {
  return (
  <>
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  </>
  )
}

export default MyApp
