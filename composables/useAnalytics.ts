import { analytics } from "~/app/data/analytics";

export const useAnalytics = () => {
    const track = (event: string, props?: Record<string, any>) => {
        if (!analytics.enabled) return;

        // Plausibleがロードされているか確認
        // @ts-ignore
        if (typeof window !== "undefined" && window.plausible) {
            // @ts-ignore
            window.plausible(event, { props });
        } else {
            console.log(`[Analytics] ${event}`, props);
        }
    };

    return {
        track,
    };
};
