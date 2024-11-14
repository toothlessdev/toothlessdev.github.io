import React from "react";
import { Link } from "gatsby";

export const mdxComponents = {
    Link: Link,
    h1: (props: any) => <h1 className="text-2xl font-bold" {...props} />,
    h2: (props: any) => <h2 className="text-xl font-bold" {...props} />,
    h3: (props: any) => <h3 className="text-lg font-bold" {...props} />,
    h4: (props: any) => <h4 className="text-md font-bold" {...props} />,
    h5: (props: any) => <h5 className="text-sm font-bold" {...props} />,
    h6: (props: any) => <h6 className="text-xs font-bold" {...props} />,
    p: (props: any) => <p className="text-[#8f97a0]" {...props} />,
    a: (props: any) => <a className="text-blue-500" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside" {...props} />,
    li: (props: any) => <li className="text-[#8f97a0]" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-blue-500 pl-2" {...props} />,
    pre: (props: any) => <pre className="p-4 bg-gray-800 rounded-[8px]" {...props} />,
    code: (props: any) => <code className="text-sm bg-gray-800 rounded-[6px] p-1" {...props} />,
    img: (props: any) => <img className="rounded-md" {...props} />,
    table: (props: any) => <table className="table-auto" {...props} />,
    th: (props: any) => <th className="border px-4 py-2" {...props} />,
    td: (props: any) => <td className="border px-4 py-2" {...props} />,
    tr: (props: any) => <tr className="border px-4 py-2" {...props} />,
    wrapper: ({ children }: { children: any }) => {
        return <div style={{ width: "100%" }}>{children}</div>;
    },
};
