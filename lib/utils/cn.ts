import { type ClassValue, clsx } from "clsx";
import { twJoin, twMerge } from "tailwind-merge";

export const cnMerge = (...classNames: ClassValue[]) => twMerge(clsx(classNames));

export const cnJoin = (...classNames: ClassValue[]) => twJoin(clsx(classNames));

export const tw = (strings: TemplateStringsArray, ...values: Array<"Not-Allowed">) => {
	const classString = strings.reduce(
		(accumulatedString, string, index) => `${accumulatedString}${string}${values[index] ?? ""}`,
		""
	);

	return classString.trim();
};
