import React, { lazy, Suspense } from "react";
const Dashboard = lazy(() => import("./Dashboard"));

export default function DashboardLoading() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
