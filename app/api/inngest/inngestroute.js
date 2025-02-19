import { serve } from "inngest/next";
import { deleteUserData, inngest, syncUserData, updateUserData } from "@/Config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserData,
    deleteUserData,
    updateUserData,
  ],
});
