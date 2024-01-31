import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { GithubPageContext } from "@/context/context";
import { prefix } from "@/config/config";

import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <GithubPageContext.Provider value={{ prefix: prefix }}>
            <Provider store={store}>
                <Component {...pageProps} />;
            </Provider>
        </GithubPageContext.Provider>
    );
}
