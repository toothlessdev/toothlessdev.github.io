export function toPlainText(text: string, length = 150) {
    const plainText = text.replace(/[#*_><`]/g, "");
    return plainText.substring(0, length);
}
