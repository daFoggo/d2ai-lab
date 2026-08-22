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
				<DialogHeader className="space-y-1.5 text-left">
					<DialogTitle className="text-xl font-bold tracking-tight">
						{activeTab === "signin" ? "Welcome back" : "Create an account"}
					</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm text-muted-foreground">
						{activeTab === "signin"
							? "Sign in to your D2AI Lab account to access your workspace."
							: "Enter your details to get started with D2AI Lab."}
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={(val) => setActiveTab(val as AuthDialogTab)}
					className="w-full mt-2"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="signin"
							className="gap-2 data-active:bg-background data-active:text-foreground data-active:shadow-xs aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-xs"
						>
							<IconLogin className="size-4 shrink-0" />
							<span>Sign In</span>
						</TabsTrigger>
						<TabsTrigger
							value="signup"
							className="gap-2 data-active:bg-background data-active:text-foreground data-active:shadow-xs aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-xs"
						>
							<IconUserPlus className="size-4 shrink-0" />
							<span>Sign Up</span>
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
