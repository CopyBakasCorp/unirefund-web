"use server";
import { permanentRedirect, RedirectType } from "next/navigation";
import { auth } from "auth";
import type { Policy } from "src/utils/page-policy/utils";

export default async function PagePolicy({
  requiredPolicies,
  children,
  lang,
}: {
  requiredPolicies: Policy[];
  children: JSX.Element;
  lang: string;
}) {
  const sessions = await auth();
  const grantedPolicies = sessions?.grantedPolicies;

  const missingPolicies = requiredPolicies.filter(
    (policy) => !grantedPolicies?.[policy],
  );
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }

  return children;
}

export async function isUnauthorized({
  requiredPolicies,
  lang,
}: {
  requiredPolicies: Policy[];
  lang: string;
}) {
  const sessions = await auth();
  const grantedPolicies = sessions?.grantedPolicies;

  const missingPolicies = requiredPolicies.filter(
    (policy) => !grantedPolicies?.[policy],
  );
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }
  return false;
}
