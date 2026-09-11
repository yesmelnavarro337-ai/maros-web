const CLOUDINARY_MARKER = "/image/upload/";

export function cloudinaryUrl(src: string, transforms = "f_auto,q_auto"): string {
  if (!src) return src;

  if (!src.includes("res.cloudinary.com")) return src;

  const idx = src.indexOf(CLOUDINARY_MARKER);
  if (idx === -1) return src;

  // Ya optimizada o con formato explícito: no la tocamos.
  if (src.includes("f_auto") && src.includes("q_auto")) return src;

  const rest = src.slice(idx + CLOUDINARY_MARKER.length);

  // Anteponemos f_auto,q_auto a la cadena de transformaciones (sea la versión
  // "v123/..." o una cadena previa existente "c_scale,w_400/v123/..."). El
  // orden de precedencia en Cloudinary respeta f_auto y consigue AVIF/WebP
  // con calidad optimizada sin perder los transforms ya presentes.
  return src.slice(0, idx + CLOUDINARY_MARKER.length) + transforms + "/" + rest;
}

export function cloudinaryUrlList(urls: string[]): string[] {
  return urls.map((u) => cloudinaryUrl(u)).filter(Boolean);
}