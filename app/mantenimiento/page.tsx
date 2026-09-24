import { getPublicSettings } from "@/features/settings/services/settings.server";
import { MaintenanceView } from "@/features/settings/components/maintenance-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MantenimientoPage() {
  const settings = await getPublicSettings();
  return <MaintenanceView settings={settings} />;
}