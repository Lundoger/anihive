export function toSnakeCase(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, "_")
		.replace(/_+/g, "_");
}