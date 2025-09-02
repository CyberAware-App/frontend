// import { useQuery } from "@tanstack/react-query";
// import { sessionQuery } from "@/lib/react-query/queryOptions";
// import { LoadingScreen } from "../-components/LoadingScreen";

function ProtectedTemplate({ children }: { children: React.ReactNode }) {
	// const sessionQueryResult = useQuery(sessionQuery());

	// if (sessionQueryResult.data) {
	// 	return children;
	// }

	// return <LoadingScreen />;

	return children;
}

export default ProtectedTemplate;
