const ipurl: string = process.env.IP_URl ?? "";
const locationurl: string = process.env.LOCATION_URL ?? "";
const locationkey: string = process.env.LOCATION_KEY ?? "";
const detailurl: string = process.env.DETAIL_URL ?? "";
import { Faker } from "./models";
import axios from "axios";
import mongoose from "mongoose";



export const work = async ({
    senderName,
    senderMail,
    receiverMail,
    subject,
    message,
    receiverName,
  }: {
    senderName: string;
    senderMail: string;
    receiverMail: string;
    subject: string;
    message: string;
    receiverName: string;
  }) => {
  
    const dburl: string = process.env.DATABASE_URL ?? "";
    const db = await mongoose.connect(dburl);
    console.log("Connected to MongoDB");
  
    try {
      // Fetch IP address
      const ipResponse = await fetch(ipurl);
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
  
      // Fetch location based on IP
      const locationResponse = await fetch(
        `${locationurl}?ip=${ip}&apiKey=${locationkey}`
      );
      const locationData = await locationResponse.json();
      const longitude: string = locationData.location.longitude;
      const latitude: string = locationData.location.latitude;
  
      // Fetch detailed location information
      const detailResponse = await fetch(
        `${detailurl}?lat=${latitude}&lon=${longitude}&format=json&apiKey=${locationkey}`
      );
      const detailData = await detailResponse.json();
  
      // Create Faker instance and save
      const faker = new Faker({
        sendername: senderName,
        sendermail: senderMail,
        receivername: receiverName,
        receivermail: receiverMail,
        subject: subject,
        content: message,
        Details: [
          {
            ip: ip,
            longitude: longitude,
            latitude: latitude,
            country: detailData.results[0].country,
            state: detailData.results[0].state,
            district: detailData.results[0].district,
            city: detailData.results[0].city,
            pincode: detailData.results[0].postcode,
            address: detailData.results[0].formatted,
          },
        ],
      });
      await faker.save();
  
      // Return the IP, longitude, and latitude
      const result = { ip, longitude, latitude };
      return result;
  
    } catch (error) {
      console.error("Error fetching IP or location data:", error);
      throw error;
    }
  };
  