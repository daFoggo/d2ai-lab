import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<h1 className="text-xl font-semibold">D2AI Lab</h1>
		</div>
	);
}
