import { AppProps } from 'next/app';
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";


export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page: ReactElement) => page);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;