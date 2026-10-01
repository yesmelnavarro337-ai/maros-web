import { serverApiFetch } from "@/lib/api/server-fetch";
import type {
  HomeSectionContent,
  HomeSectionContentMap,
  HomeSectionKey,
} from "../home-content.types";

/**
 * Contenido del Home administrable desde maros-admin.
 *
 * Es best-effort a propósito: si el API falla, el Home debe seguir mostrando las
 * secciones con sus defaults hardcodeados en vez de romperse por completo.
 */
export async function getHomeSectionContent(): Promise<HomeSectionContentMap> {
  try {
    const sections = await serverApiFetch<HomeSectionContent[]>(
      "home-content",
      { tags: ["home-content"] }
    );

    const map: HomeSectionContentMap = {};
    for (const section of sections ?? []) {
      map[section.sectionKey as HomeSectionKey] = section;
    }
    return map;
  } catch {
    return {};
  }
}