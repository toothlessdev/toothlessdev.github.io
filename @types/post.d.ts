declare interface Post<CategoryKeys> {
    node: {
        id: string;
        frontmatter: {
            title: string;
            date: string;
            category: CategoryKeys;
            slug: string;
        };
        body: string;
    };
}
