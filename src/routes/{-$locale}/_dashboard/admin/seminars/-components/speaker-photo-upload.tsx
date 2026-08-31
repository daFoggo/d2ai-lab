"use client";

import { IconPhoto, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
	AttachmentTrigger,
} from "@/components/ui/attachment";
import { getErrorMessage } from "@/lib/error";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/utils/supabase";

interface ISpeakerPhotoUploadProps {
	value?: string;
	onChange: (url: string) => void;
	disabled?: boolean;
}

/* Upload ảnh speaker lên Supabase Storage (bucket speaker-photos), lưu public URL. */
export const SpeakerPhotoUpload = ({
	value,
	onChange,
	disabled,
}: ISpeakerPhotoUploadProps) => {
	const { t } = useI18n("dashboard");
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFile = async (file: File | undefined) => {
		if (!file) return;
		setError(null);
		setUploading(true);
		try {
			const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
			const path = `${crypto.randomUUID()}.${ext}`;
			const { error: uploadError } = await supabase.storage
				.from("speaker-photos")
				.upload(path, file, { cacheControl: "3600", upsert: false });
			if (uploadError) throw uploadError;

			const { data } = supabase.storage
				.from("speaker-photos")
				.getPublicUrl(path);
			onChange(data.publicUrl);
		} catch (err) {
			setError(getErrorMessage(err, t("seminars.form.photoUploadFailed")));
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	};

	const state: "idle" | "uploading" | "error" | "done" = uploading
		? "uploading"
		: error
			? "error"
			: value
				? "done"
				: "idle";

	return (
		<Attachment state={state} className="w-full">
			<AttachmentMedia variant={value ? "image" : "icon"}>
				{value ? <img src={value} alt="" /> : <IconPhoto />}
			</AttachmentMedia>
			<AttachmentContent>
				<AttachmentTitle>
					{value ? t("seminars.form.photoDone") : t("seminars.form.photoIdle")}
				</AttachmentTitle>
				<AttachmentDescription>
					{error ?? t("seminars.form.photoHint")}
				</AttachmentDescription>
			</AttachmentContent>
			<AttachmentActions>
				{value && (
					<AttachmentAction
						onClick={() => onChange("")}
						aria-label={t("seminars.form.photoRemove")}
						disabled={disabled || uploading}
					>
						<IconX className="size-4" />
					</AttachmentAction>
				)}
			</AttachmentActions>

			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => void handleFile(e.target.files?.[0])}
				disabled={disabled || uploading}
			/>
			<AttachmentTrigger
				onClick={() => inputRef.current?.click()}
				aria-label={t("seminars.form.photoIdle")}
			/>
		</Attachment>
	);
};
