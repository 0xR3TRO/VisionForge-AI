"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

export function ToastProvider() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                className:
                    "!bg-surface-900 !border-surface-800 !text-white !shadow-xl",
                descriptionClassName: "!text-surface-400",
                duration: 4000,
            }}
            theme="dark"
            richColors
            closeButton
        />
    );
}

export { toast };
