import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "CoreLogic Systems: custom software and AI automation";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
