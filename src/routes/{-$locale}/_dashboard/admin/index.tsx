import type { Icon } from "@tabler/icons-react";
import {
	IconBriefcase,
	IconCalendarEvent,
	IconFileText,
	IconRocket,
	IconUsers,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { siteStatsQueryOptions } from "@/features/analytics";
import { DEFAULT_LOCALE, type MessageKey, useI18n } from "@/lib/i18n";

type TLinkTo = ComponentProps<typeof Link>["to"];

const QUICK_ACTIONS: {
	titleKey: MessageKey;
	descriptionKey: MessageKey;
	to: string;
	icon: Icon;
}[] = [
	{
		titleKey: "dashboard.nav.publications",
		descriptionKey: "dashboard.placeholder.description",
		to: "/admin/publications",
		icon: IconFileText,
	},
	{
		titleKey: "dashboard.nav.seminars",
		descriptionKey: "dashboard.placeholder.description",
		to: "/admin/seminars",
		icon: IconCalendarEvent,
	},
	{
		titleKey: "dashboard.nav.careers",
		descriptionKey: "dashboard.placeholder.description",
		to: "/admin/careers",
		icon: IconBriefcase,
	},
	{
		titleKey: "dashboard.nav.teams",
		descriptionKey: "dashboard.placeholder.description",
		to: "/admin/teams",
		icon: IconUsers,
	},
	{
		titleKey: "dashboard.nav.projects",
		descriptionKey: "dashboard.placeholder.description",
		to: "/admin/projects",
		icon: IconRocket,
	},
];

const AdminIndexPage = () => {
	const { t, locale } = useI18n();
	const params = { locale: locale === DEFAULT_LOCALE ? undefined : locale };
	const { data: stats } = useSuspenseQuery(siteStatsQueryOptions());

	return (
		<div className="flex flex-col gap-6">
			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.label}>
						<CardHeader>
							<CardDescription>{stat.label}</CardDescription>
							<CardTitle className="text-3xl font-semibold tabular-nums">
								{stat.value}
							</CardTitle>
						</CardHeader>
					</Card>
				))}
			</section>

			<section className="flex flex-col gap-4">
				<h2 className="font-title text-lg font-semibold">
					{t("dashboard.index.quickActions")}
				</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{QUICK_ACTIONS.map((action) => (
						<Card
							key={action.to}
							className="transition-colors hover:bg-muted/40"
						>
							<Link
								to={`/{-$locale}${action.to}` as TLinkTo}
								params={params as never}
								className="flex h-full flex-col"
							>
								<CardHeader>
									<action.icon className="size-5 text-primary" />
									<CardTitle>{t(action.titleKey)}</CardTitle>
									<CardDescription>{t(action.descriptionKey)}</CardDescription>
								</CardHeader>
								<CardContent className="mt-auto">
									<span className="text-sm font-medium text-primary">
										Manage →
									</span>
								</CardContent>
							</Link>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
};

export const Route = createFileRoute("/{-$locale}/_dashboard/admin/")({
	loader: async ({ context }) => {
		await context.queryClient.query(siteStatsQueryOptions());
	},
	component: AdminIndexPage,
});
