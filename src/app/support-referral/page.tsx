import SupportReferralPage from "@/views/SupportReferralPage/SupportReferralPage";

export default async function SupportReferral({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { reportId } = await searchParams;
  const parsed = typeof reportId === "string" ? Number(reportId) : Number.NaN;
  return <SupportReferralPage reportId={Number.isInteger(parsed) && parsed > 0 ? parsed : null} />;
}
