import { IconLogin, IconUserPlus } from "@tabler/icons-react";
import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

export type AuthDialogTab = "signin" | "signup";

export interface AuthDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	defaultTab?: AuthDialogTab;
	trigger?: React.ReactNode;
	children?: React.ReactNode;
}

export function AuthDialog({
	open,
	onOpenChange,
	defaultTab = "signin",
	trigger,
	children,
}: AuthDialogProps) {
	const [internalOpen, setInternalOpen] = React.useState(false);
	const [activeTab, setActiveTab] = React.useState<AuthDialogTab>(defaultTab);

	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const handleOpenChange = onOpenChange ?? setInternalOpen;
	const { t } = useI18n("auth");

	React.useEffect(() => {
		if (defaultTab) {
			setActiveTab(defaultTab);
		}
	}, [defaultTab]);

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
						{activeTab === "signin" ? t("welcomeBack") : t("createAccount")}
					</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm text-muted-foreground">
						{activeTab === "signin" ? t("signInDesc") : t("signUpDesc")}
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={(val) => setActiveTab(val as AuthDialogTab)}
					className="w-full mt-2"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="signin">
							<IconLogin />
							<span>{t("signIn")}</span>
						</TabsTrigger>
						<TabsTrigger value="signup">
							<IconUserPlus />
							<span>{t("signUp")}</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="signin" className="mt-4">
						<SignInForm onSuccess={handleSuccess} />
					</TabsContent>

					<TabsContent value="signup" className="mt-4">
						<SignUpForm onSuccess={handleSuccess} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
