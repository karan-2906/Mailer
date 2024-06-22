import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Faker } from "../../lib/models";

const maiurl: string = process.env.MAIL_URL ?? "";
const apikey: string = process.env.API_KEY ?? "";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const senderMail: string = body.senderMail;
  const receiverMail: string = body.receiverMail;
  const subject: string = body.subject;
  const message: string = body.message;
  const senderName: string = body.senderName;
  const receiverName: string = body.receiverName;
  const ip: string = body.ip;
  const longitude: string = body.longitude;
  const latitude: string = body.latitude;
  const country: string = body.country;
  const state: string = body.state;
  const district: string = body.district;
  const city: string = body.city;
  const pincode: string = body.pincode;
  const address: string = body.address;

  const work = async ({
    senderName,
    senderMail,
    receiverMail,
    subject,
    message,
    receiverName,
    ip,
    longitude,
    latitude,
    country,
    state,
    district,
    city,
    pincode,
    address,
  }: {
    senderName: string;
    senderMail: string;
    receiverMail: string;
    subject: string;
    message: string;
    receiverName: string;
    ip: string;
    longitude: string;
    latitude: string;
    country: string;
    state: string;
    district: string;
    city: string;
    pincode: string;
    address: string;
  }) => {
    const dburl: string = process.env.DATABASE_URL ?? "";
    const db = await mongoose.connect(dburl);
    console.log("Connected to MongoDB");

    try {
      // Create Faker instance and save
      const Dated = new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
      });
      const faker = new Faker({
        sendername: senderName,
        sendermail: senderMail,
        receivername: receiverName,
        receivermail: receiverMail,
        subject: subject,
        content: message,
        date: Dated,
        Details: {
          ip: ip,
          longitude: longitude,
          latitude: latitude,
          country: country,
          state: state,
          district: district,
          city: city,
          pincode: pincode,
          address: address,
        },
      });
      const db = await faker.save();
      console.log("Saved to MongoDB");
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
    ip,
    longitude,
    latitude,
    country,
    state,
    district,
    city,
    pincode,
    address,
  });

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
  const status = send.status;
  console.log(status);
  console.log("Mail:", send.statusText);
  return NextResponse.json({ message: "sending", status });
}
