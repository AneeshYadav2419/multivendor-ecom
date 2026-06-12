import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { settingsApi }
    from "../api/settings.api";

export const useUpdateSettings =
    () => {

        const queryClient =
            useQueryClient();

        return useMutation({
            mutationFn:
                settingsApi.updateSettings,

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "settings",
                    ],
                });
            },
        });
    };