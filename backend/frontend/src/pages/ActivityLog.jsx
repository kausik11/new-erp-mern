// src/pages/ActivityLog.jsx (Updated)
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { format } from "date-fns";

export default function ActivityLog() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => api.get("/activities").then(res => res.data),
  });

  if (isLoading) return <div className="p-8 text-center">Loading activity...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Activity Log</h1>
      <p>comming soon...</p>
      <div className="space-y-4">
        {activities?.map((act) => (
          <div
            key={act._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex justify-between items-start hover:shadow-lg transition"
          >
            <div>
              <p className="text-lg">
                <strong className="text-blue-600">{act.user?.name}</strong>{" "}
                {act.action}{" "}
                <span className="font-semibold text-indigo-600">{act.target}</span>
              </p>
              {act.details && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ↳ {act.details}
                </p>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {format(new Date(act.createdAt), "MMM dd, yyyy HH:mm")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}