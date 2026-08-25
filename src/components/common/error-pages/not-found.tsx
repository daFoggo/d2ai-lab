import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { AppLogo } from "../app-logo";

export const NotFound = () => {
	const { t } = useI18n("error");
	return (
		<div className="flex h-dvh flex-col p-6">
			<AppLogo />
			<main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
				<p className="font-mono text-6xl font-bold text-foreground">404</p>
				<p className="text-xl text-muted-foreground">{t("notFoundTitle")}</p>
				<Button
					render={<Link to="/{-$locale}" params={{ locale: undefined }} />}
					nativeButton={false}
				>
					{t("goBackHome")}
				</Button>
			</main>
		</div>
	);
};
