import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { SignInForm } from "./sign-in-form";

export interface AuthDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: React.ReactNode;
	children?: React.ReactNode;
}

/* Chỉ Sign In — tài khoản admin được tạo trực tiếp trên Supabase. */
export const AuthDialog = ({
	open,
	onOpenChange,
	trigger,
	children,
}: AuthDialogProps) => {
	const [internalOpen, setInternalOpen] = React.useState(false);

	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const handleOpenChange = onOpenChange ?? setInternalOpen;
	const { t } = useI18n("auth");

	const handleSuccess = () => {
		handleOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{trigger && <DialogTrigger>{trigger}</DialogTrigger>}
			{children}
			<DialogContent className="sm:max-w-md p-6 sm:p-8">
				<DialogHeader className="text-left">
					<DialogTitle className="text-xl tracking-tight">
						{t("welcomeBack")}
					</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm text-muted-foreground">
						{t("signInDesc")}
					</DialogDescription>
				</DialogHeader>

				<div className="mt-2">
					<SignInForm onSuccess={handleSuccess} />
				</div>
			</DialogContent>
		</Dialog>
	);
};
