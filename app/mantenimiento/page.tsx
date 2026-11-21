import { redirect } from "next/navigation";
import { getPublicSettings } from "@/features/settings/services/settings.server";
import { MaintenanceView } from "@/features/settings/components/maintenance-view";

export const revalidate = 300;

export default async function MantenimientoPage() {
  const settings = await getPublicSettings();
  if (!settings.maintenanceMode) {
    redirect("/");
  }
  return <MaintenanceView settings={settings} />;
}