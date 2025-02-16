import { ProductsContextProvider } from "../../components/ProductsContext";
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ProductsContextProvider>
            <Component {...pageProps} />
        </ProductsContextProvider>
    );
}

export default MyApp;
