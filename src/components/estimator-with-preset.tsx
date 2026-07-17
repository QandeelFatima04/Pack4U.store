"use client";

import { useSearchParams } from "next/navigation";
import { Estimator } from "@/components/estimator";

/** Reads ?type=<packaging-type slug> on the client so /estimate stays statically
 *  rendered — reading searchParams on the server would make the whole page
 *  dynamic. Render inside <Suspense>. */
export function EstimatorWithPreset() {
  const type = useSearchParams().get("type") ?? undefined;
  return <Estimator defaultTypeSlug={type} />;
}
