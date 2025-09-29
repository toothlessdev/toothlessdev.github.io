export function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
}
