export interface Post {
    url: string;
    frontmatter: {
        title: string;
        createdAt: string;
        category: string;
        description: string;
    };
}

export interface PostFrontmatter {
    title: string;
    createdAt: string;
    category: string;
    description: string;
}
