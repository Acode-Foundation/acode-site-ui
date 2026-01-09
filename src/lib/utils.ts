import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidGithubId(id: string) {
	if (!id) return true;
	return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(id);
}
