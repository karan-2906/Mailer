import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        sendermail: {
            type: String,
           required: true
        },
        sendername: {
            type: String,
           required: true
        },
        receivername: {
            type: String,
           required: true
        },
        receivermail: {
            type: String,
           required: true
        },
        content: {
            type: String,
           required: true
        },
        subject: {
            type: String,
           required: true
        },
        Details: {
            ip: {
                type: String,
               required: true
            },
            latitude: {
                type: String,
               required: true
            },
            longitude: {
                type: String,
               required: true
            },
            country: {
                type: String,
               required: true
            },
            state: {
                type: String,
               required: true
            },
            district: {
                type: String,
               required: true
            },
            city: {
                type: String,
               required: true
            },
            pincode: {
                type: String,
               required: true
            },
            address: {
                type: String,
               required: true
            },
        },
    },
    { timestamps: true }
)

export const Faker = mongoose.models.User || mongoose.model('User', userSchema)