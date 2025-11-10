// // src/pages/ActivityLog.jsx (Updated)
// import { useQuery } from "@tanstack/react-query";
// import api from "../lib/api";
// import { format } from "date-fns";

// export default function ActivityLog() {
//   const { data: activities, isLoading } = useQuery({
//     queryKey: ["activities"],
//     queryFn: () => api.get("/activities").then(res => res.data),
//   });

//   if (isLoading) return <div className="p-8 text-center">Loading activity...</div>;

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Activity Log</h1>
//       <div className="space-y-4">
//         {activities?.map((act) => (
//           <div
//             key={act._id}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex justify-between items-start hover:shadow-lg transition"
//           >
//             <div>
//               <p className="text-lg">
//                 <strong className="text-blue-600">{act.user?.name}</strong>{" "}
//                 {act.action}{" "}
//                 <span className="font-semibold text-indigo-600">{act.target}</span>
//               </p>
//               {act.details && (
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   ↳ {act.details}
//                 </p>
//               )}
//             </div>
//             <span className="text-sm text-gray-500">
//               {format(new Date(act.createdAt), "MMM dd, yyyy HH:mm")}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// src/pages/ActivityLog.jsx (Inline Styles)
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { format } from "date-fns";

export default function ActivityLog() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => api.get("/activities").then(res => res.data),
  });

  if (isLoading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading activity...
      </div>
    );

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Activity Log
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {activities?.map((act) => (
          <div
            key={act._id}
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)")
            }
          >
            <div>
              <p style={{ fontSize: "1.125rem", margin: 0 }}>
                <strong style={{ color: "#2563eb" }}>
                  {act.user?.name}
                </strong>{" "}
                {act.action}{" "}
                <span style={{ fontWeight: 600, color: "#4f46e5" }}>
                  {act.target}
                </span>
              </p>

              {act.details && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                  }}
                >
                  ↳ {act.details}
                </p>
              )}
            </div>

            <span
              style={{
                fontSize: "0.875rem",
                color: "#9ca3af",
                whiteSpace: "nowrap",
              }}
            >
              {format(new Date(act.createdAt), "MMM dd, yyyy HH:mm")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
