import userModel from "@/Model/User";
import { Inngest } from "inngest";
import { ConnectDb } from "./Database";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserData = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      console.log('Received event data:', event.data); // Add logging

      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
      };

      console.log(userData);
      

      await connectDb();
      console.log('Database connected successfully'); // Add logging

      await userModel.create(userData);
      console.log(`User ${id} created successfully.`);
    } catch (error) {
      console.error(`Error creating user: ${error}`);
    }
  }
);
// for inngest update

export const updateUserData = inngest.createFunction(
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

    await ConnectDb();
    await userModel.findByIdAndUpdate(id, userData);
  }
);

export const deleteUserData = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await ConnectDb();
    await userModel.findByIdAndDelete(id);
  }
);
