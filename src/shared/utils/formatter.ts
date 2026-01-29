export function toSnakeCase(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, "_")
		.replace(/_+/g, "_");
}


export const toTitleCase = (string: string | null) => {
	if (!string) return null;
	return string.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};