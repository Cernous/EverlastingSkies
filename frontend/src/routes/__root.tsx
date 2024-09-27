import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createRootRoute({
    component: () => (
        <>
            <Suspense>
                    <Outlet />
            </Suspense>
        </>
    )
})