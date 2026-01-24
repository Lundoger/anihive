"use server";
import { cookies } from "next/headers";

export async function getSfwParam(): Promise<string> {
	try {
		const cookieStore = await cookies();
		const sfw = cookieStore.get("sfw");
		return sfw?.value === "false" ? "false" : "true";
	} catch {
		return "false";
	}
}