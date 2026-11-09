import type { DeepfakeBand } from "./detectApi";

export const bandClass: Record<DeepfakeBand, { bg: string; text: string; bar: string }> = {
  HIGH: { bg: "bg-red-50", text: "text-red-500", bar: "bg-red-500" },
  UNCERTAIN: { bg: "bg-yellow-50", text: "text-yellow-500", bar: "bg-yellow-500" },
  LOW: { bg: "bg-green-50", text: "text-green-500", bar: "bg-green-500" },
  UNDETERMINED: { bg: "bg-gray-100", text: "text-gray-650", bar: "bg-gray-300" },
};
