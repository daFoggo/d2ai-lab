import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface ISeminarsPaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const SeminarsPagination = ({
	page,
	totalPages,
	onPageChange,
}: ISeminarsPaginationProps) => {
	const { t } = useI18n("seminars");

	return (
		<div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
			<p className="text-sm text-muted-foreground">
				{t("page")
					.replace("{page}", String(page))
					.replace("{totalPages}", String(totalPages))}
			</p>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
				>
					{t("previous")}
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					{t("next")}
				</Button>
			</div>
		</div>
	);
};
