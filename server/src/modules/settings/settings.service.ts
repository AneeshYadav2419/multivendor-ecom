import { settingsRepository }
    from "./settings.repository.js";

import { UpdateSettingsDto }
    from "./settings.types.js";

export const settingsService = {
    async getSettings() {
        let settings =
            await settingsRepository.findFirst();

        if (!settings) {
            settings =
                await settingsRepository.createDefault();
        }

        return settings;
    },

    async updateSettings(
        data: UpdateSettingsDto
    ) {
        const settings =
            await this.getSettings();

        return settingsRepository.update(
            settings.id,
            data
        );
    },
};