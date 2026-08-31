import { IconHammer } from "@tabler/icons-react";
import { useI18n } from "@/lib/i18n";

/* Trang placeholder — title hiển thị ở DashboardHeader (breadcrumb). */
export const ContentPlaceholder = () => {
	const { t } = useI18n("dashboard");

	return (
		<div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
			<IconHammer className="size-8 text-muted-foreground" />
			<p className="text-sm font-medium">{t("placeholder.title")}</p>
			<p className="max-w-md text-sm text-muted-foreground">
				{t("placeholder.description")}
			</p>
		</div>
	);
};
