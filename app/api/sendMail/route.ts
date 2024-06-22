import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Faker } from "../../lib/models";
import axios from "axios";

const maiurl: string = process.env.MAIL_URL;
const ipurl: string = process.env.IP_URl;
const locationurl: string = process.env.LOCATION_URL;
const locationkey: string = process.env.LOCATION_KEY;
const detailurl: string = process.env.DETAIL_URL;
const apikey: string = process.env.API_KEY;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const senderMail: string = body.senderMail;
  const receiverMail: string = body.receiverMail;
  const subject: string = body.subject;
  const message: string = body.message;
  const senderName: string = body.senderName;
  const receiverName: string = body.receiverName;

  const work = async ({
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

  const mongo = await work({
    senderName,
    senderMail,
    receiverMail,
    subject,
    message,
    receiverName,
  });
  console.log("Returned Data:", mongo);
  const headers = new Headers();
  headers.set("api-key", apikey);

  const send = await fetch(maiurl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderMail,
      },
      subject: subject,
      textContent: message,
      to: [
        {
          name: receiverName,
          email: receiverMail,
        },
      ],
    }),
  });
  console.log(send.statusText);
  return NextResponse.json({ message: "sending", mongo });
}

// export const work = async ({
//   senderName,
//   senderMail,
//   receiverMail,
//   subject,
//   message,
//   receiverName,
// }: {
//   senderName: string;
//   senderMail: string;
//   receiverMail: string;
//   subject: string;
//   message: string;
//   receiverName: string;
// }) => {

//   const dburl: string = process.env.DATABASE_URL ?? "";
//   const db = await mongoose.connect(dburl);
//   console.log("Connected to MongoDB");

//   try {
//     // Fetch IP address
//     const ipResponse = await fetch(ipurl);
//     const ipData = await ipResponse.json();
//     const ip = ipData.ip;

//     // Fetch location based on IP
//     const locationResponse = await fetch(
//       `${locationurl}?ip=${ip}&apiKey=${locationkey}`
//     );
//     const locationData = await locationResponse.json();
//     const longitude: string = locationData.location.longitude;
//     const latitude: string = locationData.location.latitude;

//     // Fetch detailed location information
//     const detailResponse = await fetch(
//       `${detailurl}?lat=${latitude}&lon=${longitude}&format=json&apiKey=${locationkey}`
//     );
//     const detailData = await detailResponse.json();

//     // Create Faker instance and save
//     const faker = new Faker({
//       sendername: senderName,
//       sendermail: senderMail,
//       receivername: receiverName,
//       receivermail: receiverMail,
//       subject: subject,
//       content: message,
//       Details: [
//         {
//           ip: ip,
//           longitude: longitude,
//           latitude: latitude,
//           country: detailData.results[0].country,
//           state: detailData.results[0].state,
//           district: detailData.results[0].district,
//           city: detailData.results[0].city,
//           pincode: detailData.results[0].postcode,
//           address: detailData.results[0].formatted,
//         },
//       ],
//     });
//     await faker.save();

//     // Return the IP, longitude, and latitude
//     const result = { ip, longitude, latitude };
//     return result;

//   } catch (error) {
//     console.error("Error fetching IP or location data:", error);
//     throw error;
//   }
// };
