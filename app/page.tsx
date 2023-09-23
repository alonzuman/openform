import React from "react";
import { getServerUser } from "~/lib/auth";
import { Dashboard } from "./dashboard";
import { LandingPage } from "./landing-page";

export default async function Page() {
  const user = await getServerUser();
  return user ? <Dashboard /> : <LandingPage />;
}
