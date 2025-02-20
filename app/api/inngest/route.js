import { serve } from "inngest/next";
import {  inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/Config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
  ],
});
