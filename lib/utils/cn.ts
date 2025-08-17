import { twJoin, twMerge } from "tailwind-merge";

export const cnMerge: typeof twMerge = (...classNames) => twMerge(classNames);

export const cnJoin: typeof twJoin = (...classNames) => twJoin(classNames);

export const tw = (strings: TemplateStringsArray, ...values: Array<"Not-Allowed">) => {
	const classString = strings.reduce(
		(accumulatedString, string, index) => `${accumulatedString}${string}${values[index] ?? ""}`,
		""
	);

	return classString.trim();
};
