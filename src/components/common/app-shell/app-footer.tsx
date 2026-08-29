import {
	IconArrowUp,
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandX,
	IconBrandYoutube,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface IAppFooterProps {
	brandName: string;
	labs: { label: string; href: string }[];
	className?: string;
}

export const AppFooter = ({ brandName, labs, className }: IAppFooterProps) => {
	const { t } = useI18n();
	const handleScrollToTop = () => {
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<footer
			className={cn(
				"w-full overflow-hidden border-t border-primary-foreground/15 bg-primary pt-10 pb-8 text-primary-foreground sm:pt-14 sm:pb-10",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{/* Other research teams and initiative areas */}
				<div className="flex flex-col justify-between gap-3 text-xs text-primary-foreground/80 sm:flex-row sm:items-center sm:text-sm">
					<span className="font-semibold text-primary-foreground">
						{t("common.footer.labsLabel")}
					</span>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
						{labs.map((lab) => (
							<a
								key={lab.label}
								href={lab.href}
								className="transition-colors hover:text-primary-foreground focus:outline-hidden"
							>
								{lab.label}
							</a>
						))}
					</div>
				</div>

				{/* Bold Massive Typography */}
				<div className="py-8 text-center select-none sm:py-12 lg:py-16">
					<span className="inline-block font-title text-6xl font-bold tracking-tighter text-primary-foreground/90 transition-colors hover:text-primary-foreground sm:text-7xl md:text-8xl lg:text-9xl">
						{brandName}
					</span>
				</div>

				{/* Bottom Bar */}
				<div className="flex flex-col justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/80 sm:flex-row sm:items-center sm:text-sm">
					{/* Left: Brand + Slogan + Socials */}
					<div className="flex flex-wrap items-center gap-4 sm:gap-6">
						<div className="flex items-center gap-2">
							<span className="font-title font-bold text-primary-foreground">
								{brandName}
							</span>
							<span>· {t("common.footer.slogan")}</span>
						</div>

						{/* Social Media Icons */}
						<div className="flex items-center gap-3 border-l border-primary-foreground/15 pl-4 sm:pl-6">
							<a
								href="https://x.com"
								target="_blank"
								rel="noreferrer"
								aria-label="X / Twitter"
								className="transition-colors hover:text-primary-foreground focus:outline-hidden"
							>
								<IconBrandX className="size-4" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noreferrer"
								aria-label="LinkedIn"
								className="transition-colors hover:text-primary-foreground focus:outline-hidden"
							>
								<IconBrandLinkedin className="size-4" />
							</a>
							<a
								href="https://youtube.com"
								target="_blank"
								rel="noreferrer"
								aria-label="YouTube"
								className="transition-colors hover:text-primary-foreground focus:outline-hidden"
							>
								<IconBrandYoutube className="size-4" />
							</a>
							<a
								href="https://github.com"
								target="_blank"
								rel="noreferrer"
								aria-label="GitHub"
								className="transition-colors hover:text-primary-foreground focus:outline-hidden"
							>
								<IconBrandGithub className="size-4" />
							</a>
						</div>
					</div>

					{/* Right: Smooth Back To Top Button */}
					<div>
						<Button
							variant="ghost"
							className="hover:bg-primary-foreground/10 hover:text-primary-foreground"
							onClick={handleScrollToTop}
						>
							{t("common.backToTop")}
							<IconArrowUp
								data-icon="inline-end"
								className="transition-transform group-hover/button:-translate-y-0.5"
							/>
						</Button>
					</div>
				</div>
			</div>
		</footer>
	);
};
