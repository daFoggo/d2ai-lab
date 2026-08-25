import {
	IconAlertCircle,
	IconLoader2,
	IconLock,
	IconMail,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/error";
import { useI18n } from "@/lib/i18n";
import { useSignUpMutation } from "../queries";
import { SignUpInputSchema } from "../schemas";

export interface SignUpFormProps {
	onSuccess?: () => void;
}

function getFieldError(err: unknown): string {
	if (!err) return "";
	if (typeof err === "string") return err;
	if (typeof err === "object" && "message" in err) {
		return String((err as { message?: unknown }).message ?? "");
	}
	return String(err);
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
	const signUpMutation = useSignUpMutation();
	const [serverError, setServerError] = React.useState<string | null>(null);
	const { t } = useI18n("auth");

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: SignUpInputSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				const res = await signUpMutation.mutateAsync(value);
				if (res.session) {
					toast.success(t("signUpSuccess"));
				} else {
					toast.success(t("signUpVerify"));
				}
				onSuccess?.();
			} catch (err) {
				setServerError(getErrorMessage(err, t("signUpError")));
			}
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="flex flex-col gap-4 pt-1"
		>
			{serverError && (
				<div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
					<IconAlertCircle className="size-4 shrink-0 mt-0.5" />
					<span className="leading-snug">{serverError}</span>
				</div>
			)}

			<form.Field
				name="email"
				validators={{
					onBlur: ({ value }) => {
						const result = SignUpInputSchema.shape.email.safeParse(value);
						return result.success ? undefined : result.error.issues[0]?.message;
					},
				}}
			>
				{(field) => {
					const errorMsg = getFieldError(field.state.meta.errors[0]);
					return (
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor={`signup-${field.name}`}
								className="text-xs font-medium text-foreground"
							>
								{t("email")}
							</Label>
							<div className="relative">
								<Input
									id={`signup-${field.name}`}
									name={field.name}
									type="email"
									placeholder={t("emailPlaceholder")}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={signUpMutation.isPending}
									aria-invalid={field.state.meta.errors.length > 0}
									className="h-10 px-3 pl-9 text-sm"
								/>
								<IconMail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							</div>
							{errorMsg && (
								<p className="text-xs text-destructive font-medium">
									{errorMsg}
								</p>
							)}
						</div>
					);
				}}
			</form.Field>

			<form.Field
				name="password"
				validators={{
					onBlur: ({ value }) => {
						const result = SignUpInputSchema.shape.password.safeParse(value);
						return result.success ? undefined : result.error.issues[0]?.message;
					},
				}}
			>
				{(field) => {
					const errorMsg = getFieldError(field.state.meta.errors[0]);
					return (
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor={`signup-${field.name}`}
								className="text-xs font-medium text-foreground"
							>
								{t("password")}
							</Label>
							<div className="relative">
								<Input
									id={`signup-${field.name}`}
									name={field.name}
									type="password"
									placeholder={t("passwordMinHint")}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={signUpMutation.isPending}
									aria-invalid={field.state.meta.errors.length > 0}
									className="h-10 px-3 pl-9 text-sm"
								/>
								<IconLock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							</div>
							{errorMsg && (
								<p className="text-xs text-destructive font-medium">
									{errorMsg}
								</p>
							)}
						</div>
					);
				}}
			</form.Field>

			<form.Field
				name="confirmPassword"
				validators={{
					onBlur: ({ value, fieldApi }) => {
						if (!value) return t("confirmPasswordError");
						const password = fieldApi.form.getFieldValue("password");
						if (value !== password) {
							return t("passwordsDontMatch");
						}
						return undefined;
					},
				}}
			>
				{(field) => {
					const errorMsg = getFieldError(field.state.meta.errors[0]);
					return (
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor={`signup-${field.name}`}
								className="text-xs font-medium text-foreground"
							>
								{t("confirmPassword")}
							</Label>
							<div className="relative">
								<Input
									id={`signup-${field.name}`}
									name={field.name}
									type="password"
									placeholder={t("confirmPasswordPlaceholder")}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={signUpMutation.isPending}
									aria-invalid={field.state.meta.errors.length > 0}
									className="h-10 px-3 pl-9 text-sm"
								/>
								<IconLock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							</div>
							{errorMsg && (
								<p className="text-xs text-destructive font-medium">
									{errorMsg}
								</p>
							)}
						</div>
					);
				}}
			</form.Field>

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
			>
				{([canSubmit, isSubmitting]) => (
					<Button
						type="submit"
						size="lg"
						className="w-full mt-2"
						disabled={!canSubmit || signUpMutation.isPending || isSubmitting}
					>
						{signUpMutation.isPending || isSubmitting ? (
							<>
								<IconLoader2 className="mr-2 size-4 animate-spin" />
								{t("creatingAccount")}
							</>
						) : (
							t("signUp")
						)}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
