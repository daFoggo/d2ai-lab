"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type TSeminarAdminItem,
	useDeleteSeminarMutation,
} from "@/features/seminars";
import { getErrorMessage } from "@/lib/error";
import { useI18n } from "@/lib/i18n";

interface IDeleteSeminarDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	seminar: TSeminarAdminItem | null;
}

export const DeleteSeminarDialog = ({
	open,
	onOpenChange,
	seminar,
}: IDeleteSeminarDialogProps) => {
	const { t } = useI18n("dashboard");
	const deleteMutation = useDeleteSeminarMutation();

	const handleDelete = async () => {
		if (!seminar) return;
		try {
			await deleteMutation.mutateAsync(seminar.id);
			toast.success(t("seminars.deleted"));
			onOpenChange(false);
		} catch (error) {
			toast.error(getErrorMessage(error, t("seminars.deleteFailed")));
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("seminars.deleteTitle")}</DialogTitle>
					<DialogDescription>
						{t("seminars.deleteDescription")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={deleteMutation.isPending}
					>
						{t("seminars.cancel")}
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						{t("seminars.deleteConfirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
