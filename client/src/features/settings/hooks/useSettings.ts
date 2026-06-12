import { useQuery }
    from "@tanstack/react-query";

import { settingsApi }
    from "../api/settings.api";

export const useSettings = () => {
    return useQuery({
        queryKey: ["settings"],
        queryFn:
            settingsApi.getSettings,
    });
};