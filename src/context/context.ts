import React from "react";

interface IGithubPageContext {
    prefix: string | null;
}

export const GithubPageContext = React.createContext<IGithubPageContext>({
    prefix: null,
});
