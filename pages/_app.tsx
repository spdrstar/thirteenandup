// pages/_app.tsx
import '../styles/fonts.css';  // Path to your fonts.css file
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
