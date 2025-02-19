import userModel from "@/Model/User";
import { Inngest } from "inngest";
import { ConnectDb } from "./Database";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserData = inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    },
    {event : 'clerk/user.created'},
    async({event}) => {
        const { id , first_name , last_name , email_addressess , image_url } = event.data;
        const userData = {
            _id : id,
            name : first_name + ' ' + last_name ,
            email : email_addressess[0].email.address,
            imageUrl : image_url 
        }

        await ConnectDb()
        await userModel.create(userData)
    }
)

// for inngest updatation

export const updateUserData = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event : 'clerk/user.created'},

    async ({event}) => {
        const {id , first_name , last_name , email_addressess, image_url} = event.data;
        const userData = {
            _id : id,
            name : first_name + ' ' + last_name,
            email : email_addressess[0].email.address,
            imageUrl : image_url
        }

        await ConnectDb()
        await userModel.findByIdAndUpdate(id , userData)
    }
)

export const deleteUserData = inngest.createFunction(
    {id : 'delete-user-from-clerk'},
    {event : 'clerk/user.created'},
    async ({event}) => {
        const {id} = event.data;
        await ConnectDb()
        await userModel.findByIdAndDelete(id)
    }
)