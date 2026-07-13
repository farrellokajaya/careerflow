"use client";

import type {
  ApplicationPriority,
  ApplicationStatus,
  EmploymentType,
  WorkType,
} from "@/generated/prisma/enums";
import { LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useActionState } from "react";

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

const initialState: ActionResult = {
  success: false,
  message: "",
};

type JobApplicationFormAction = (
  previousState: ActionResult,
  formData: FormData,
) => Promise<ActionResult>;

export type JobApplicationCompanyOption = {
  id: string;
  name: string;
  isArchived: boolean;
};

export type JobApplicationFormInitialValues = {
  companyId: string;
  position: string;
  jobUrl: string | null;
  employmentType: EmploymentType;
  workType: WorkType;
  location: string | null;
  salaryMin: string | null;
  salaryMax: string | null;
  salaryCurrency: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  source: string | null;
  appliedAt: string | null;
  deadlineAt: string | null;
  description: string | null;
  requirements: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

type JobApplicationFormProps = {
  action: JobApplicationFormAction;
  mode: "create" | "edit";
  companyOptions: JobApplicationCompanyOption[];
  initialValues?: JobApplicationFormInitialValues;
};

type FieldMessageProps = {
  id: string;
  error?: string;
  description: string;
};

function getFieldError(errors: ActionResult["errors"], field: string): string | undefined {
  return errors?.[field]?.[0];
}

function FieldMessage({ id, error, description }: FieldMessageProps) {
  if (error) {
    return (
      <p id={id} role="alert" className="text-sm text-destructive">
        {error}
      </p>
    );
  }

  return (
    <p id={id} className="text-xs text-muted-foreground">
      {description}
    </p>
  );
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      <span className="ml-1 text-xs font-normal text-destructive">(wajib)</span>
    </Label>
  );
}

export function JobApplicationForm({
  action,
  mode,
  companyOptions,
  initialValues,
}: JobApplicationFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const isEditMode = mode === "edit";

  const companyIdError = getFieldError(state.errors, "companyId");
  const positionError = getFieldError(state.errors, "position");
  const jobUrlError = getFieldError(state.errors, "jobUrl");
  const employmentTypeError = getFieldError(state.errors, "employmentType");
  const workTypeError = getFieldError(state.errors, "workType");
  const locationError = getFieldError(state.errors, "location");
  const salaryMinError = getFieldError(state.errors, "salaryMin");
  const salaryMaxError = getFieldError(state.errors, "salaryMax");
  const salaryCurrencyError = getFieldError(state.errors, "salaryCurrency");
  const statusError = getFieldError(state.errors, "status");
  const priorityError = getFieldError(state.errors, "priority");
  const sourceError = getFieldError(state.errors, "source");
  const appliedAtError = getFieldError(state.errors, "appliedAt");
  const deadlineAtError = getFieldError(state.errors, "deadlineAt");
  const descriptionError = getFieldError(state.errors, "description");
  const requirementsError = getFieldError(state.errors, "requirements");
  const contactNameError = getFieldError(state.errors, "contactName");
  const contactEmailError = getFieldError(state.errors, "contactEmail");
  const contactPhoneError = getFieldError(state.errors, "contactPhone");

  return (
    <form action={formAction} noValidate className="space-y-8">
      {state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </div>
      ) : null}

      <fieldset className="space-y-6">
        <div>
          <legend className="text-base font-semibold">Informasi utama</legend>

          <p className="mt-1 text-sm text-muted-foreground">
            Tentukan company, posisi, serta jenis pekerjaan yang dilamar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <RequiredLabel htmlFor="companyId">Company</RequiredLabel>

            <Select name="companyId" defaultValue={initialValues?.companyId} disabled={isPending}>
              <SelectTrigger
                id="companyId"
                className="w-full"
                aria-required="true"
                aria-invalid={Boolean(companyIdError)}
                aria-describedby="company-id-message"
              >
                <SelectValue placeholder="Pilih company aktif" />
              </SelectTrigger>

              <SelectContent>
                {companyOptions.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                    {company.isArchived ? " (Arsip)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FieldMessage
              id="company-id-message"
              error={companyIdError}
              description="Hanya company aktif milik akun Anda yang dapat dipilih saat membuat lamaran."
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <RequiredLabel htmlFor="position">Posisi</RequiredLabel>

            <Input
              id="position"
              name="position"
              type="text"
              defaultValue={initialValues?.position ?? ""}
              placeholder="Contoh: Junior Backend Developer"
              autoComplete="organization-title"
              aria-required="true"
              aria-invalid={Boolean(positionError)}
              aria-describedby="position-message"
              disabled={isPending}
            />

            <FieldMessage
              id="position-message"
              error={positionError}
              description="Minimal 2 karakter dan maksimal 150 karakter."
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="jobUrl">Job URL</Label>

            <Input
              id="jobUrl"
              name="jobUrl"
              type="url"
              defaultValue={initialValues?.jobUrl ?? ""}
              placeholder="https://example.com/jobs/backend-developer"
              autoComplete="url"
              aria-invalid={Boolean(jobUrlError)}
              aria-describedby="job-url-message"
              disabled={isPending}
            />

            <FieldMessage
              id="job-url-message"
              error={jobUrlError}
              description="Opsional. Gunakan URL http atau https."
            />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="employmentType">Jenis pekerjaan</RequiredLabel>

            <Select
              name="employmentType"
              defaultValue={initialValues?.employmentType ?? "FULL_TIME"}
              disabled={isPending}
            >
              <SelectTrigger
                id="employmentType"
                className="w-full"
                aria-required="true"
                aria-invalid={Boolean(employmentTypeError)}
                aria-describedby="employment-type-message"
              >
                <SelectValue placeholder="Pilih jenis pekerjaan" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="CONTRACT">Kontrak</SelectItem>
                <SelectItem value="INTERNSHIP">Magang</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <FieldMessage
              id="employment-type-message"
              error={employmentTypeError}
              description="Pilih jenis hubungan kerja pada lowongan."
            />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="workType">Sistem kerja</RequiredLabel>

            <Select
              name="workType"
              defaultValue={initialValues?.workType ?? "ONSITE"}
              disabled={isPending}
            >
              <SelectTrigger
                id="workType"
                className="w-full"
                aria-required="true"
                aria-invalid={Boolean(workTypeError)}
                aria-describedby="work-type-message"
              >
                <SelectValue placeholder="Pilih sistem kerja" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ONSITE">On-site</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
                <SelectItem value="REMOTE">Remote</SelectItem>
              </SelectContent>
            </Select>

            <FieldMessage
              id="work-type-message"
              error={workTypeError}
              description="Pilih lokasi kerja utama yang tercantum pada lowongan."
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="location">Lokasi</Label>

            <Input
              id="location"
              name="location"
              type="text"
              defaultValue={initialValues?.location ?? ""}
              placeholder="Contoh: Jakarta, Indonesia"
              autoComplete="address-level2"
              aria-invalid={Boolean(locationError)}
              aria-describedby="location-message"
              disabled={isPending}
            />

            <FieldMessage
              id="location-message"
              error={locationError}
              description="Opsional, maksimal 150 karakter."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t pt-8">
        <div>
          <legend className="text-base font-semibold">Status dan tracking</legend>

          <p className="mt-1 text-sm text-muted-foreground">
            Atur status awal, prioritas, sumber, serta tanggal penting lamaran.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status awal</Label>

            <Select
              name="status"
              defaultValue={initialValues?.status ?? "WISHLIST"}
              disabled={isPending}
            >
              <SelectTrigger
                id="status"
                className="w-full"
                aria-invalid={Boolean(statusError)}
                aria-describedby="status-message"
              >
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="WISHLIST">Wishlist</SelectItem>
                <SelectItem value="APPLIED">Melamar</SelectItem>
                <SelectItem value="SCREENING">Screening</SelectItem>
                <SelectItem value="INTERVIEW">Interview</SelectItem>
                <SelectItem value="TECHNICAL_TEST">Tes teknis</SelectItem>
                <SelectItem value="OFFER">Penawaran</SelectItem>
                <SelectItem value="ACCEPTED">Diterima</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
                <SelectItem value="WITHDRAWN">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>

            <FieldMessage
              id="status-message"
              error={statusError}
              description="Default status adalah Wishlist."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritas</Label>

            <Select
              name="priority"
              defaultValue={initialValues?.priority ?? "MEDIUM"}
              disabled={isPending}
            >
              <SelectTrigger
                id="priority"
                className="w-full"
                aria-invalid={Boolean(priorityError)}
                aria-describedby="priority-message"
              >
                <SelectValue placeholder="Pilih prioritas" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LOW">Rendah</SelectItem>
                <SelectItem value="MEDIUM">Sedang</SelectItem>
                <SelectItem value="HIGH">Tinggi</SelectItem>
              </SelectContent>
            </Select>

            <FieldMessage
              id="priority-message"
              error={priorityError}
              description="Default prioritas adalah Sedang."
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="source">Sumber lowongan</Label>

            <Input
              id="source"
              name="source"
              type="text"
              defaultValue={initialValues?.source ?? ""}
              placeholder="Contoh: LinkedIn, JobStreet, atau referral"
              autoComplete="off"
              aria-invalid={Boolean(sourceError)}
              aria-describedby="source-message"
              disabled={isPending}
            />

            <FieldMessage
              id="source-message"
              error={sourceError}
              description="Opsional, maksimal 100 karakter."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appliedAt">Tanggal melamar</Label>

            <Input
              id="appliedAt"
              name="appliedAt"
              type="date"
              defaultValue={initialValues?.appliedAt ?? ""}
              aria-invalid={Boolean(appliedAtError)}
              aria-describedby="applied-at-message"
              disabled={isPending}
            />

            <FieldMessage
              id="applied-at-message"
              error={appliedAtError}
              description="Opsional. Isi jika lamaran sudah dikirim."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadlineAt">Deadline lamaran</Label>

            <Input
              id="deadlineAt"
              name="deadlineAt"
              type="date"
              defaultValue={initialValues?.deadlineAt ?? ""}
              aria-invalid={Boolean(deadlineAtError)}
              aria-describedby="deadline-at-message"
              disabled={isPending}
            />

            <FieldMessage
              id="deadline-at-message"
              error={deadlineAtError}
              description="Opsional. Gunakan deadline yang tercantum pada lowongan."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t pt-8">
        <div>
          <legend className="text-base font-semibold">Kompensasi</legend>

          <p className="mt-1 text-sm text-muted-foreground">
            Simpan rentang gaji bila informasi tersebut tersedia.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_10rem]">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Gaji minimum</Label>

            <Input
              id="salaryMin"
              name="salaryMin"
              type="text"
              inputMode="decimal"
              defaultValue={initialValues?.salaryMin ?? ""}
              placeholder="Contoh: 7000000"
              autoComplete="off"
              aria-invalid={Boolean(salaryMinError)}
              aria-describedby="salary-min-message"
              disabled={isPending}
            />

            <FieldMessage
              id="salary-min-message"
              error={salaryMinError}
              description="Opsional. Gunakan angka tanpa pemisah ribuan."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Gaji maksimum</Label>

            <Input
              id="salaryMax"
              name="salaryMax"
              type="text"
              inputMode="decimal"
              defaultValue={initialValues?.salaryMax ?? ""}
              placeholder="Contoh: 10000000"
              autoComplete="off"
              aria-invalid={Boolean(salaryMaxError)}
              aria-describedby="salary-max-message"
              disabled={isPending}
            />

            <FieldMessage
              id="salary-max-message"
              error={salaryMaxError}
              description="Harus sama dengan atau lebih besar dari gaji minimum."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryCurrency">Mata uang</Label>

            <Input
              id="salaryCurrency"
              name="salaryCurrency"
              type="text"
              defaultValue={initialValues?.salaryCurrency ?? "IDR"}
              placeholder="IDR"
              minLength={3}
              maxLength={3}
              autoComplete="off"
              className="uppercase"
              aria-invalid={Boolean(salaryCurrencyError)}
              aria-describedby="salary-currency-message"
              disabled={isPending}
            />

            <FieldMessage
              id="salary-currency-message"
              error={salaryCurrencyError}
              description="Gunakan 3 huruf, contoh IDR atau USD."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t pt-8">
        <div>
          <legend className="text-base font-semibold">Detail lowongan</legend>

          <p className="mt-1 text-sm text-muted-foreground">
            Tambahkan ringkasan pekerjaan dan persyaratan penting.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi pekerjaan</Label>

            <Textarea
              id="description"
              name="description"
              defaultValue={initialValues?.description ?? ""}
              rows={6}
              placeholder="Tuliskan ringkasan tanggung jawab dan informasi penting lainnya..."
              aria-invalid={Boolean(descriptionError)}
              aria-describedby="description-message"
              disabled={isPending}
            />

            <FieldMessage
              id="description-message"
              error={descriptionError}
              description="Opsional, maksimal 5000 karakter."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Persyaratan</Label>

            <Textarea
              id="requirements"
              name="requirements"
              defaultValue={initialValues?.requirements ?? ""}
              rows={6}
              placeholder="Tuliskan skill, pengalaman, atau persyaratan utama..."
              aria-invalid={Boolean(requirementsError)}
              aria-describedby="requirements-message"
              disabled={isPending}
            />

            <FieldMessage
              id="requirements-message"
              error={requirementsError}
              description="Opsional, maksimal 5000 karakter."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t pt-8">
        <div>
          <legend className="text-base font-semibold">Kontak</legend>

          <p className="mt-1 text-sm text-muted-foreground">
            Simpan informasi recruiter atau kontak terkait bila tersedia.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactName">Nama kontak</Label>

            <Input
              id="contactName"
              name="contactName"
              type="text"
              defaultValue={initialValues?.contactName ?? ""}
              placeholder="Contoh: Budi Santoso"
              autoComplete="name"
              aria-invalid={Boolean(contactNameError)}
              aria-describedby="contact-name-message"
              disabled={isPending}
            />

            <FieldMessage
              id="contact-name-message"
              error={contactNameError}
              description="Opsional, maksimal 100 karakter."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email kontak</Label>

            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initialValues?.contactEmail ?? ""}
              placeholder="recruiter@example.com"
              autoComplete="email"
              aria-invalid={Boolean(contactEmailError)}
              aria-describedby="contact-email-message"
              disabled={isPending}
            />

            <FieldMessage
              id="contact-email-message"
              error={contactEmailError}
              description="Opsional. Gunakan alamat email yang valid."
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="contactPhone">Nomor telepon kontak</Label>

            <Input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              defaultValue={initialValues?.contactPhone ?? ""}
              placeholder="Contoh: +62 812 3456 7890"
              autoComplete="tel"
              aria-invalid={Boolean(contactPhoneError)}
              aria-describedby="contact-phone-message"
              disabled={isPending}
            />

            <FieldMessage
              id="contact-phone-message"
              error={contactPhoneError}
              description="Opsional, maksimal 30 karakter."
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" className="sm:min-w-28">
          <Link href="/applications">Batal</Link>
        </Button>

        <Button type="submit" disabled={isPending} className="sm:min-w-44">
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save aria-hidden="true" />
              {isEditMode ? "Perbarui lamaran" : "Simpan lamaran"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
