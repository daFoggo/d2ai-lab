"use client";

import {
	IconBriefcase,
	IconCalendar,
	IconPlus,
	IconTrash,
	IconUser,
} from "@tabler/icons-react";
import { useForm, useSelector } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
	seminarUpsertInputSchema,
	type TSeminarDetail,
	type TSeminarSpeakerForm,
	type TSeminarUpsertInput,
} from "@/features/seminars";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SpeakerPhotoUpload } from "./speaker-photo-upload";

/* Form values (presentation): date + single time. Submit ghép → startsAt ISO.
   Status không có — tính từ starts_at. */
export type SeminarFormValues = {
	title: string;
	description: string;
	date: string;
	time: string;
	location: string;
	registrationUrl: string;
	speakers: TSeminarSpeakerForm[];
};

export const emptySeminarFormValues = (): SeminarFormValues => ({
	title: "",
	description: "",
	date: "",
	time: "",
	location: "",
	registrationUrl: "",
	speakers: [],
});

const toLocalTime = (iso: string): string => {
	const date = new Date(iso);
	return `${String(date.getHours()).padStart(2, "0")}:${String(
		date.getMinutes(),
	).padStart(2, "0")}`;
};

export const seminarDetailToFormValues = (
	seminar: TSeminarDetail,
): SeminarFormValues => ({
	title: seminar.title,
	description: seminar.description,
	date: seminar.dateIso ?? "",
	time: seminar.startsAtIso ? toLocalTime(seminar.startsAtIso) : "",
	location: seminar.location ?? "",
	registrationUrl: seminar.registrationUrl ?? "",
	speakers: seminar.speakers.map((speaker) => ({
		key: speaker.id,
		name: speaker.name,
		role: speaker.role,
		photoUrl: speaker.photo,
		socials: speaker.socials?.join("\n") ?? "",
	})),
});

/* "YYYY-MM-DD" + "HH:MM" → ISO datetime (local → UTC qua toISOString). */
export const isoFromLocalDateTime = (date: string, time: string): string => {
	if (!date || !time) return "";
	return new Date(`${date}T${time}`).toISOString();
};

/* ── Date helpers: field lưu "YYYY-MM-DD", calendar dùng Date (local, tránh TZ shift). ── */
const toISODate = (date: Date): string => {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
};

const parseISODate = (iso: string): Date | undefined => {
	const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (!match) return undefined;
	return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const formatDisplayDate = (iso: string): string => {
	const date = parseISODate(iso);
	if (!date) return iso;
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

interface ISeminarFormProps {
	initial: SeminarFormValues;
	isSubmitting?: boolean;
	submitLabel: string;
	onCancel: () => void;
	onSubmit: (values: TSeminarUpsertInput) => void;
}

const getFieldError = (err: unknown): string => {
	if (!err) return "";
	if (typeof err === "string") return err;
	if (typeof err === "object" && "message" in err) {
		return String((err as { message?: unknown }).message ?? "");
	}
	return String(err);
};

interface IFieldShellProps {
	label: string;
	htmlFor?: string;
	error?: string;
	children: ReactNode;
	className?: string;
}

const FieldShell = ({
	label,
	htmlFor,
	error,
	children,
	className,
}: IFieldShellProps) => (
	<div className={cn("flex flex-col gap-1.5", className)}>
		{/* Giữ default của Label — không override font size/weight (06_quality_rules). */}
		<Label htmlFor={htmlFor}>{label}</Label>
		{children}
		{error ? (
			<p className="text-xs font-medium text-destructive">{error}</p>
		) : null}
	</div>
);

export const SeminarForm = ({
	initial,
	isSubmitting,
	submitLabel,
	onCancel,
	onSubmit,
}: ISeminarFormProps) => {
	const { t } = useI18n("dashboard");
	const f = (key: string) => t(`seminars.form.${key}` as never);

	const form = useForm({
		defaultValues: initial,
		validators: {
			onSubmit: ({ value }) => {
				if (!value.title?.trim()) {
					return { fields: { title: "Title is required" } };
				}
				if (!value.description?.trim()) {
					return { fields: { description: "Description is required" } };
				}
				if (!value.date) {
					return { fields: { date: "Date is required" } };
				}
				if (!value.time) {
					return { fields: { time: "Time is required" } };
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			onSubmit(
				seminarUpsertInputSchema.parse({
					...value,
					startsAt: isoFromLocalDateTime(value.date, value.time),
				}),
			);
		},
	});

	const speakers = useSelector(
		form.store,
		(s: { values: { speakers?: TSeminarSpeakerForm[] } }) =>
			s.values.speakers ?? [],
	);

	const addSpeaker = () =>
		form.setFieldValue("speakers", [
			...speakers,
			{
				key: crypto.randomUUID(),
				name: "",
				role: "",
				photoUrl: "",
				socials: "",
			},
		]);
	const removeSpeaker = (index: number) =>
		form.setFieldValue(
			"speakers",
			speakers.filter((_, i) => i !== index),
		);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="flex flex-col gap-5"
		>
			{/* ── Actions: Cancel + Save trên cùng hàng ── */}
			<div className="flex items-center justify-end gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onCancel}
					disabled={isSubmitting}
				>
					{t("seminars.cancel")}
				</Button>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, formSubmitting]) => (
						<Button
							type="submit"
							size="sm"
							disabled={!canSubmit || isSubmitting || formSubmitting}
						>
							{submitLabel}
						</Button>
					)}
				</form.Subscribe>
			</div>

			{/* ── Basic info ── */}
			<form.Field name="title">
				{(field) => (
					<FieldShell
						label={f("title")}
						htmlFor={field.name}
						error={getFieldError(field.state.meta.errors[0])}
					>
						<Input
							id={field.name}
							name={field.name}
							value={field.state.value ?? ""}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							disabled={isSubmitting}
							placeholder={f("titlePlaceholder")}
						/>
					</FieldShell>
				)}
			</form.Field>

			<form.Field name="description">
				{(field) => (
					<FieldShell
						label={f("description")}
						htmlFor={field.name}
						error={getFieldError(field.state.meta.errors[0])}
					>
						<Textarea
							id={field.name}
							name={field.name}
							value={field.state.value ?? ""}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							disabled={isSubmitting}
							placeholder={f("descriptionPlaceholder")}
							rows={4}
						/>
					</FieldShell>
				)}
			</form.Field>

			{/* ── Schedule ── */}
			{/* Schedule: date+time / location+regis. Không ép full width (md:max-w-2xl). */}
			<div className="grid gap-4 sm:grid-cols-2 md:max-w-2xl">
				<form.Field name="date">
					{(field) => {
						const value = field.state.value ?? "";
						return (
							<FieldShell
								label={f("date")}
								htmlFor={field.name}
								error={getFieldError(field.state.meta.errors[0])}
							>
								<Popover>
									<PopoverTrigger
										render={
											<Button
												variant="outline"
												data-empty={!value}
												className="w-full justify-start gap-2 text-left data-[empty=true]:text-muted-foreground"
											/>
										}
									>
										<IconCalendar className="size-4" />
										{value ? formatDisplayDate(value) : f("datePlaceholder")}
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={value ? parseISODate(value) : undefined}
											onSelect={(date) =>
												field.handleChange(date ? toISODate(date) : "")
											}
										/>
									</PopoverContent>
								</Popover>
							</FieldShell>
						);
					}}
				</form.Field>

				<form.Field name="time">
					{(field) => (
						<FieldShell
							label={f("time")}
							htmlFor={field.name}
							error={getFieldError(field.state.meta.errors[0])}
						>
							<Input
								id={field.name}
								name={field.name}
								type="time"
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								disabled={isSubmitting}
							/>
						</FieldShell>
					)}
				</form.Field>

				<form.Field name="location">
					{(field) => (
						<FieldShell
							label={f("location")}
							htmlFor={field.name}
							error={getFieldError(field.state.meta.errors[0])}
						>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								disabled={isSubmitting}
								placeholder={f("locationPlaceholder")}
							/>
						</FieldShell>
					)}
				</form.Field>

				<form.Field name="registrationUrl">
					{(field) => (
						<FieldShell
							label={f("registrationUrl")}
							htmlFor={field.name}
							error={getFieldError(field.state.meta.errors[0])}
						>
							<Input
								id={field.name}
								name={field.name}
								type="url"
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								disabled={isSubmitting}
								placeholder={f("registrationUrlPlaceholder")}
							/>
						</FieldShell>
					)}
				</form.Field>
			</div>

			{/* ── Speakers ── */}
			<div className="flex items-center justify-between">
				<p className="font-medium">{f("speakers")}</p>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={addSpeaker}
					disabled={isSubmitting}
				>
					<IconPlus className="size-4" />
					{f("addSpeaker")}
				</Button>
			</div>

			{speakers.length === 0 ? (
				<p className="text-sm text-muted-foreground">{f("noSpeakers")}</p>
			) : (
				<div className="grid gap-4 lg:grid-cols-2">
					{speakers.map((speaker, speakerIndex) => (
						<div
							key={speaker.key ?? speakerIndex}
							className="flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-4"
						>
							<div className="flex items-center justify-between gap-3">
								<p className="font-medium">
									{f("speaker")} {speakerIndex + 1}
								</p>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="text-destructive"
									onClick={() => removeSpeaker(speakerIndex)}
									disabled={isSubmitting}
								>
									<IconTrash className="size-4" />
									{f("removeSpeaker")}
								</Button>
							</div>

							<SpeakerPhotoUpload
								value={speaker.photoUrl ?? ""}
								onChange={(url) =>
									form.setFieldValue(`speakers[${speakerIndex}].photoUrl`, url)
								}
								disabled={isSubmitting}
							/>

							<div className="grid gap-4 sm:grid-cols-2">
								<form.Field name={`speakers[${speakerIndex}].name`}>
									{(field) => (
										<FieldShell
											label={f("speakerName")}
											htmlFor={field.name}
											error={getFieldError(field.state.meta.errors[0])}
										>
											<InputGroup>
												<InputGroupAddon align="inline-start">
													<IconUser className="size-4" />
												</InputGroupAddon>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value ?? ""}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													disabled={isSubmitting}
													placeholder={f("speakerNamePlaceholder")}
												/>
											</InputGroup>
										</FieldShell>
									)}
								</form.Field>

								<form.Field name={`speakers[${speakerIndex}].role`}>
									{(field) => (
										<FieldShell
											label={f("speakerRole")}
											htmlFor={field.name}
											error={getFieldError(field.state.meta.errors[0])}
										>
											<InputGroup>
												<InputGroupAddon align="inline-start">
													<IconBriefcase className="size-4" />
												</InputGroupAddon>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value ?? ""}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													disabled={isSubmitting}
													placeholder={f("speakerRolePlaceholder")}
												/>
											</InputGroup>
										</FieldShell>
									)}
								</form.Field>
							</div>

							<form.Field name={`speakers[${speakerIndex}].socials`}>
								{(field) => (
									<FieldShell
										label={f("socials")}
										htmlFor={field.name}
										error={getFieldError(field.state.meta.errors[0])}
									>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={isSubmitting}
											placeholder={f("socialsPlaceholder")}
											rows={2}
										/>
									</FieldShell>
								)}
							</form.Field>
						</div>
					))}
				</div>
			)}
		</form>
	);
};
