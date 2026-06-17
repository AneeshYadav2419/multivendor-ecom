
// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";

// import { useSettings }
//     from "../hooks/useSettings";

// import { useUpdateSettings }
//     from "../hooks/useUpdateSettings";

    
//   interface SettingsFormProps {
//   defaultValues: any;
//   updateSettings: (values: any) => void;
// }

// export default function SettingsForm({
//          defaultValues,
//          updateSettings,
//     } : SettingsFormProps
// ) {

//     const {
//         data,
//         isLoading,
//     } = useSettings();

//     const updateSettings =
//         useUpdateSettings();

//     const {
//         register,
//         handleSubmit,
//         reset,
//     } = useForm();

//     useEffect(() => {
//         if (data) {
//             reset(data);
//         }
//     }, [data, reset]);

//     const onSubmit = async (
//         values: any
//     ) => {
//         await updateSettings.mutateAsync({
//             ...values,
//             taxRate: Number(
//                 values.taxRate
//             ),
//         });
//     };

//     if (isLoading) {
//         return (
//             <div className="p-6">
//                 Loading settings...
//             </div>
//         );
//     }

//     return (
//         <form
//             onSubmit={handleSubmit(
//                 onSubmit
//             )}
//             className="space-y-6"
//         >

//             {/* Header */}
//             <div>
//                 <h1
//                     className="
//                         text-3xl
//                         font-bold
//                     "
//                 >
//                     Settings
//                 </h1>

//                 <p
//                     className="
//                         mt-1
//                         text-slate-400
//                     "
//                 >
//                     Manage store
//                     configuration
//                 </p>
//             </div>

//             {/* General Settings */}
//             <div
//                 className="
//                     rounded-2xl
//                     border
//                     border-slate-800
//                     bg-slate-900/50
//                     p-6
//                 "
//             >
//                 <h2
//                     className="
//                         mb-6
//                         text-lg
//                         font-semibold
//                     "
//                 >
//                     General Settings
//                 </h2>

//                 <div
//                     className="
//                         grid
//                         gap-4
//                         md:grid-cols-2
//                     "
//                 >
//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Store Name
//                         </label>

//                         <input
//                             {...register(
//                                 "storeName"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>

//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Support Email
//                         </label>

//                         <input
//                             {...register(
//                                 "supportEmail"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>

//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Support Phone
//                         </label>

//                         <input
//                             {...register(
//                                 "supportPhone"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Business Settings */}
//             <div
//                 className="
//                     rounded-2xl
//                     border
//                     border-slate-800
//                     bg-slate-900/50
//                     p-6
//                 "
//             >
//                 <h2
//                     className="
//                         mb-6
//                         text-lg
//                         font-semibold
//                     "
//                 >
//                     Business Settings
//                 </h2>

//                 <div
//                     className="
//                         grid
//                         gap-4
//                         md:grid-cols-2
//                     "
//                 >
//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Currency
//                         </label>

//                         <select
//                             {...register(
//                                 "currency"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         >
//                             <option>
//                                 INR
//                             </option>

//                             <option>
//                                 USD
//                             </option>

//                             <option>
//                                 EUR
//                             </option>
//                         </select>
//                     </div>

//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Tax Rate (%)
//                         </label>

//                         <input
//                             type="number"
//                             {...register(
//                                 "taxRate"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* System Settings */}
//             <div
//                 className="
//                     rounded-2xl
//                     border
//                     border-slate-800
//                     bg-slate-900/50
//                     p-6
//                 "
//             >
//                 <h2
//                     className="
//                         mb-6
//                         text-lg
//                         font-semibold
//                     "
//                 >
//                     System Settings
//                 </h2>

//                 <label
//                     className="
//                         flex
//                         items-center
//                         gap-3
//                     "
//                 >
//                     <input
//                         type="checkbox"
//                         {...register(
//                             "maintenanceMode"
//                         )}
//                     />

//                     <span>
//                         Maintenance
//                         Mode
//                     </span>
//                 </label>
//             </div>

//             <button
//                 type="submit"
//                 disabled={
//                     updateSettings.isPending
//                 }
//                 className="
//                     rounded-xl
//                     bg-indigo-600
//                     px-6
//                     py-3
//                     font-medium
//                     hover:bg-indigo-500
//                     transition
//                 "
//             >
//                 {
//                     updateSettings.isPending
//                         ? "Saving..."
//                         : "Save Changes"
//                 }
//             </button>
//         </form>
//     );
// }


// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";

// import { useSettings }
//     from "../hooks/useSettings";

// import { useUpdateSettings }
//     from "../hooks/useUpdateSettings";

    
//   interface SettingsFormProps {
//   defaultValues: any;
//   updateSettings: (values: any) => void;
// }

// export default function SettingsForm({
//          defaultValues,
         
//     } : SettingsFormProps
// ) {

//     const {
//         data,
//         isLoading,
//     } = useSettings();

//     const updateSettings =
//         useUpdateSettings();

//     const {
//         register,
//         handleSubmit,
//         reset,
//     } = useForm();

//     useEffect(() => {
//         if (data) {
//             reset(data);
//         }
//     }, [data, reset]);

//     const onSubmit = async (
//         values: any
//     ) => {
//         await updateSettings.mutateAsync({
//             ...values,
//             taxRate: Number(
//                 values.taxRate
//             ),
//         });
//     };

//     if (isLoading) {
//         return (
//             <div className="p-6">
//                 Loading settings...
//             </div>
//         );
//     }

//     return (
//         <form
//             onSubmit={handleSubmit(
//                 onSubmit
//             )}
//             className="space-y-6"
//         >

//             {/* Header */}
//             <div>
//                 <h1
//                     className="
//                         text-3xl
//                         font-bold
//                     "
//                 >
//                     Settings
//                 </h1>

//                 <p
//                     className="
//                         mt-1
//                         text-slate-400
//                     "
//                 >
//                     Manage store
//                     configuration
//                 </p>
//             </div>

//             {/* General Settings */}
//             <div
//                 className="
//                     rounded-2xl
//                     border
//                     border-slate-800
//                     bg-slate-900/50
//                     p-6
//                 "
//             >
//                 <h2
//                     className="
//                         mb-6
//                         text-lg
//                         font-semibold
//                     "
//                 >
//                     General Settings
//                 </h2>

//                 <div
//                     className="
//                         grid
//                         gap-4
//                         md:grid-cols-2
//                     "
//                 >
//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Store Name
//                         </label>

//                         <input
//                             {...register(
//                                 "storeName"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>

//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Support Email
//                         </label>

//                         <input
//                             {...register(
//                                 "supportEmail"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>

//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Support Phone
//                         </label>

//                         <input
//                             {...register(
//                                 "supportPhone"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Business Settings */}
//             <div
//                 className="
//                     rounded-2xl
//                     border
//                     border-slate-800
//                     bg-slate-900/50
//                     p-6
//                 "
//             >
//                 <h2
//                     className="
//                         mb-6
//                         text-lg
//                         font-semibold
//                     "
//                 >
//                     Business Settings
//                 </h2>

//                 <div
//                     className="
//                         grid
//                         gap-4
//                         md:grid-cols-2
//                     "
//                 >
//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Currency
//                         </label>

//                         <select
//                             {...register(
//                                 "currency"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         >
//                             <option>
//                                 INR
//                             </option>

//                             <option>
//                                 USD
//                             </option>

//                             <option>
//                                 EUR
//                             </option>
//                         </select>
//                     </div>

//                     <div>
//                         <label
//                             className="
//                                 mb-2
//                                 block
//                                 text-sm
//                             "
//                         >
//                             Tax Rate (%)
//                         </label>

//                         <input
//                             type="number"
//                             {...register(
//                                 "taxRate"
//                             )}
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 bg-slate-950
//                                 p-3
//                             "
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* System Settings */}
//             <div
//                 className="
//                     rounded-2xl
//                     border
//                     border-slate-800
//                     bg-slate-900/50
//                     p-6
//                 "
//             >
//                 <h2
//                     className="
//                         mb-6
//                         text-lg
//                         font-semibold
//                     "
//                 >
//                     System Settings
//                 </h2>

//                 <label
//                     className="
//                         flex
//                         items-center
//                         gap-3
//                     "
//                 >
//                     <input
//                         type="checkbox"
//                         {...register(
//                             "maintenanceMode"
//                         )}
//                     />

//                     <span>
//                         Maintenance
//                         Mode
//                     </span>
//                 </label>
//             </div>

//             <button
//                 type="submit"
//                 disabled={
//                     updateSettings.isPending
//                 }
//                 className="
//                     rounded-xl
//                     bg-indigo-600
//                     px-6
//                     py-3
//                     font-medium
//                     hover:bg-indigo-500
//                     transition
//                 "
//             >
//                 {
//                     updateSettings.isPending
//                         ? "Saving..."
//                         : "Save Changes"
//                 }
//             </button>
//         </form>
//     );
// }

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useUpdateSettings } from "../hooks/useUpdateSettings";

interface SettingsFormProps {
  defaultValues: any;
}

export default function SettingsForm({
  defaultValues,
}: SettingsFormProps) {
  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (values: any) => {
    await updateSettings.mutateAsync({
      ...values,
      taxRate: Number(values.taxRate),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="mt-1 text-slate-400">
          Manage store configuration
        </p>
      </div>

      {/* General Settings */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-6 text-lg font-semibold">
          General Settings
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm">
              Store Name
            </label>

            <input
              {...register("storeName")}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Support Email
            </label>

            <input
              {...register("supportEmail")}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Support Phone
            </label>

            <input
              {...register("supportPhone")}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
            />
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-6 text-lg font-semibold">
          Business Settings
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm">
              Currency
            </label>

            <select
              {...register("currency")}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
            >
              <option>INR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Tax Rate (%)
            </label>

            <input
              type="number"
              {...register("taxRate")}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-6 text-lg font-semibold">
          System Settings
        </h2>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("maintenanceMode")}
          />

          <span>
            Maintenance Mode
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={updateSettings.isPending}
        className="rounded-xl bg-indigo-600 px-6 py-3 font-medium hover:bg-indigo-500 transition"
      >
        {updateSettings.isPending
          ? "Saving..."
          : "Save Changes"}
      </button>
    </form>
  );
}