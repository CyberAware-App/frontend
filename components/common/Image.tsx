import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import NextImage from "next/image";

export function Image(props: InferProps<typeof NextImage>) {
	return <NextImage {...props} />;
}
