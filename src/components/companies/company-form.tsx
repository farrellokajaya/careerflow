"use client";

import type { CompanySize } from "@/generated/prisma/enums";
import { LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/types/action-result";

const EMPTY_COMPANY_SIZE_VALUE = "__NONE__";

const initialState: ActionResult = {
  success: false,
  message: "",
};

type CompanyFormAction = (previousState: ActionResult, formData: FormData) => Promise<ActionResult>;

type CompanyFormInitialValues = {
  name: string;
  website: string | null;
  industry: string | null;
  size: CompanySize | null;
  location: string | null;
  description: string | null;
  logoUrl: string | null;
  linkedinUrl: string | null;
};

type CompanyFormProps = {
  action: CompanyFormAction;
  mode: "create" | "edit";
  initialValues?: CompanyFormInitialValues;
};

function getFieldError(errors: ActionResult["errors"], field: string): string | undefined {
  return errors?.[field]?.[0];
}

export function CompanyForm({ action, mode, initialValues }: CompanyFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const isEditMode = mode === "edit";

  const nameError = getFieldError(state.errors, "name");
  const websiteError = getFieldError(state.errors, "website");
  const industryError = getFieldError(state.errors, "industry");
  const sizeError = getFieldError(state.errors, "size");
  const locationError = getFieldError(state.errors, "location");
  const descriptionError = getFieldError(state.errors, "description");
  const logoUrlError = getFieldError(state.errors, "logoUrl");
  const linkedinUrlError = getFieldError(state.errors, "linkedinUrl");

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="name">
            Nama perusahaan
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          </Label>

          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={initialValues?.name ?? ""}
            placeholder="Contoh: Tokopedia"
            autoComplete="organization"
            aria-required="true"
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "name-error" : "name-description"}
            disabled={isPending}
          />

          {nameError ? (
            <p id="name-error" role="alert" className="text-sm text-destructive">
              {nameError}
            </p>
          ) : (
            <p id="name-description" className="text-xs text-muted-foreground">
              Minimal 2 karakter dan maksimal 100 karakter.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>

          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={initialValues?.website ?? ""}
            placeholder="https://example.com"
            autoComplete="url"
            aria-invalid={Boolean(websiteError)}
            aria-describedby={websiteError ? "website-error" : "website-description"}
            disabled={isPending}
          />

          {websiteError ? (
            <p id="website-error" role="alert" className="text-sm text-destructive">
              {websiteError}
            </p>
          ) : (
            <p id="website-description" className="text-xs text-muted-foreground">
              Opsional. Gunakan URL http atau https.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>

          <Input
            id="industry"
            name="industry"
            type="text"
            defaultValue={initialValues?.industry ?? ""}
            placeholder="Contoh: Technology"
            autoComplete="off"
            aria-invalid={Boolean(industryError)}
            aria-describedby={industryError ? "industry-error" : "industry-description"}
            disabled={isPending}
          />

          {industryError ? (
            <p id="industry-error" role="alert" className="text-sm text-destructive">
              {industryError}
            </p>
          ) : (
            <p id="industry-description" className="text-xs text-muted-foreground">
              Opsional, maksimal 100 karakter.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Ukuran perusahaan</Label>

          <Select
            name="size"
            defaultValue={initialValues?.size ?? EMPTY_COMPANY_SIZE_VALUE}
            disabled={isPending}
          >
            <SelectTrigger
              id="size"
              className="w-full"
              aria-invalid={Boolean(sizeError)}
              aria-describedby={sizeError ? "size-error" : "size-description"}
            >
              <SelectValue placeholder="Pilih ukuran perusahaan" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={EMPTY_COMPANY_SIZE_VALUE}>Tidak ditentukan</SelectItem>

              <SelectItem value="STARTUP">Startup</SelectItem>
              <SelectItem value="SMALL">Small</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LARGE">Large</SelectItem>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          {sizeError ? (
            <p id="size-error" role="alert" className="text-sm text-destructive">
              {sizeError}
            </p>
          ) : (
            <p id="size-description" className="text-xs text-muted-foreground">
              Opsional dan dapat dikosongkan kembali.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Lokasi</Label>

          <Input
            id="location"
            name="location"
            type="text"
            defaultValue={initialValues?.location ?? ""}
            placeholder="Contoh: Jakarta, Indonesia"
            autoComplete="address-level2"
            aria-invalid={Boolean(locationError)}
            aria-describedby={locationError ? "location-error" : "location-description"}
            disabled={isPending}
          />

          {locationError ? (
            <p id="location-error" role="alert" className="text-sm text-destructive">
              {locationError}
            </p>
          ) : (
            <p id="location-description" className="text-xs text-muted-foreground">
              Opsional, maksimal 150 karakter.
            </p>
          )}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="description">Deskripsi</Label>

          <Textarea
            id="description"
            name="description"
            defaultValue={initialValues?.description ?? ""}
            rows={5}
            placeholder="Tuliskan informasi singkat tentang perusahaan..."
            aria-invalid={Boolean(descriptionError)}
            aria-describedby={descriptionError ? "description-error" : "description-description"}
            disabled={isPending}
          />

          {descriptionError ? (
            <p id="description-error" role="alert" className="text-sm text-destructive">
              {descriptionError}
            </p>
          ) : (
            <p id="description-description" className="text-xs text-muted-foreground">
              Opsional, maksimal 1000 karakter.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>

          <Input
            id="logoUrl"
            name="logoUrl"
            type="url"
            defaultValue={initialValues?.logoUrl ?? ""}
            placeholder="https://example.com/logo.png"
            autoComplete="url"
            aria-invalid={Boolean(logoUrlError)}
            aria-describedby={logoUrlError ? "logo-url-error" : "logo-url-description"}
            disabled={isPending}
          />

          {logoUrlError ? (
            <p id="logo-url-error" role="alert" className="text-sm text-destructive">
              {logoUrlError}
            </p>
          ) : (
            <p id="logo-url-description" className="text-xs text-muted-foreground">
              Opsional. Upload logo belum tersedia.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>

          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            defaultValue={initialValues?.linkedinUrl ?? ""}
            placeholder="https://www.linkedin.com/company/example"
            autoComplete="url"
            aria-invalid={Boolean(linkedinUrlError)}
            aria-describedby={linkedinUrlError ? "linkedin-url-error" : "linkedin-url-description"}
            disabled={isPending}
          />

          {linkedinUrlError ? (
            <p id="linkedin-url-error" role="alert" className="text-sm text-destructive">
              {linkedinUrlError}
            </p>
          ) : (
            <p id="linkedin-url-description" className="text-xs text-muted-foreground">
              Opsional. Harus menggunakan domain linkedin.com.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" className="sm:min-w-28">
          <Link href="/companies">Batal</Link>
        </Button>

        <Button type="submit" disabled={isPending} className="sm:min-w-40">
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save aria-hidden="true" />
              {isEditMode ? "Perbarui company" : "Simpan company"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
