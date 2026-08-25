import { IconHome, IconRotate, IconTriangle } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { AppLogo } from "../app-logo";

export const ErrorFallback = ({ reset }: { reset: () => void }) => {
	const { t } = useI18n("error");
	return (
		<div className="flex h-dvh flex-col p-6">
			<AppLogo />
			<main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
				<p className="font-mono text-6xl font-bold text-foreground">500</p>
				<p className="text-xl text-muted-foreground">{t("serverError")}</p>
				<div className="flex gap-2">
					<Button onClick={() => reset()} variant="outline">
						{t("tryAgain")}
						<IconRotate data-icon="inline-end" />
					</Button>
					<Button
						render={<Link to="/{-$locale}" params={{ locale: undefined }} />}
						nativeButton={false}
					>
						{t("goBackHome")}
						<IconHome data-icon="inline-end" />
					</Button>
				</div>
			</main>
		</div>
	);
};

export const NestedErrorFallback = ({
	reset,
	error,
}: {
	reset: () => void;
	error?: unknown;
}) => {
	const { t } = useI18n("error");
	return (
		<div className="flex h-full min-h-80 w-full flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
			<div className="rounded-full bg-destructive/10 p-3 text-destructive shadow-inner">
				<IconTriangle className="size-8" />
			</div>
			<div className="mx-auto flex max-w-md flex-col gap-2">
				<h3 className="text-lg font-semibold tracking-tight text-foreground">
					{t("failedSection")}
				</h3>
				<p className="text-sm leading-relaxed text-muted-foreground">
					{error instanceof Error ? error.message : t("unexpected")}
				</p>
			</div>
			<Button onClick={() => reset()} variant="outline" className="mt-2">
				<IconRotate data-icon="inline-start" />
				{t("reloadSection")}
			</Button>
		</div>
	);
};
