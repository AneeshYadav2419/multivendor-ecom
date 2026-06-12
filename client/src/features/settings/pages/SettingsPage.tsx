"use client";

import SettingsForm from "../components/SettingsForm";
import SettingsSkeleton from "../components/SettingsSkeleton";

export default function SettingsPage() {
    const { data, isLoading, mutate } = useSettings(); // your hook

    if (isLoading) return <SettingsSkeleton />;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>

            <SettingsForm
                defaultValues={data}
                updateSettings={mutate}
            />
        </div>
    );
}