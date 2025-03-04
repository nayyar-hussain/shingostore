import userModel from "@/Model/User";
import { Inngest } from "inngest";
import { connectDb } from "./Database";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
   
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
      };

      

      await connectDb();

      await userModel.create(userData);
   
  }
);
// for inngest update

export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };

    await connectDb();
    await userModel.findByIdAndUpdate(id, userData);
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDb();
    await userModel.findByIdAndDelete(id);
  }
);
