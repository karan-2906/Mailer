"use client"
import { useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";
const ipurl: string = process.env.NEXT_PUBLIC_IP_URl ?? "https://ipapi.co/json";
const locationurl: string = process.env.NEXT_PUBLIC_LOCATION_URL ?? "https://api.geoapify.com/v1/ipinfo?";
const locationkey: string = process.env.NEXT_PUBLIC_LOCATION_KEY ?? "";
const detailurl: string = process.env.NEXT_PUBLIC_DETAIL_URL ?? "https://api.geoapify.com/v1/geocode/reverse";


export default function Home() {
  const [senderMail, setSenderMail] = useState("");
  const [receiverMail, setReceiverMail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");

  const sendMail = async ({
    ip,
    longitude,
    latitude,
    country,
    state,
    district,
    city,
    pincode,
    address
  }: {
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
      try {
      let response = await fetch('/api/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senderMail: senderMail,
          receiverMail: receiverMail,
          subject: subject,
          message: message,
          senderName: senderName,
          receiverName: receiverName,
          ip: ip,
          longitude: longitude,
          latitude: latitude,
          country: country,
          state: state,
          district: district,
          city: city,
          pincode: pincode,
          address: address
        })
      });
      response = await response.json();
      console.log(response)
      return ("MAIL SENT")
    }
    catch (error) {
      console.error("Error fetching IP or location data:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted")
    // Fetch IP address
    const ipResponse = await fetch(ipurl);
    const ipData = await ipResponse.json();
    const ip = ipData.ip;
    console.log(ip)

    // Fetch location based on IP
    const locationResponse = await fetch(
      `${locationurl}?ip=${ip}&apiKey=${locationkey}`
    );
    const locationData = await locationResponse.json();
    const longitude: string = locationData.location.longitude;
    const latitude: string = locationData.location.latitude;
    console.log(locationData.location)

    // Fetch detailed location information
    const detailResponse = await fetch(
      `${detailurl}?lat=${latitude}&lon=${longitude}&format=json&apiKey=${locationkey}`
    );
    const detailData = await detailResponse.json();
    const done = await sendMail({
      ip: ip,
      longitude: longitude,
      latitude: latitude,
      country: detailData.results[0].country,
      state: detailData.results[0].state,
      district: detailData.results[0].district,
      city: detailData.results[0].city,
      pincode: detailData.results[0].postcode,
      address: detailData.results[0].formatted,
    });
    console.log(done)
    return done
  };

  return (
    <div className="text-center m-auto pt-[10%] ">
      <p className="font-bold text-5xl pb-10">Welcome to Mailer </p>
      <form className="flex flex-col gap-5 mx-auto w-1/2 items-center text-black" onSubmit={handleSubmit}>
        <input required type="text" className="p-2 placeholder:text-gray-700 w-full" placeholder="Sender Name" onChange={(e) => setSenderName(e.target.value)} />
        <input required type="email" className="p-2 placeholder:text-gray-700 w-full" placeholder="Sender Email" onChange={(e) => setSenderMail(e.target.value)} />
        <input required type="text" className="p-2 placeholder:text-gray-700 w-full" placeholder="Receiver Name" onChange={(e) => setReceiverName(e.target.value)} />
        <input required type="email" className="p-2 placeholder:text-gray-700 w-full" placeholder="Receiver Email" onChange={(e) => setReceiverMail(e.target.value)} />
        <input required type="text" className="p-2 placeholder:text-gray-700 w-full" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
        <textarea required placeholder="Message" rows={3} className="p-2 placeholder:text-gray-700 col-span-2 w-full" onChange={(e) => setMessage(e.target.value)} />
        <button type="submit" className="bg-blue-600 p-2 w-fit px-20 hover:bg-blue-950">Send Mail</button>
      </form>
    </div>
  );
}
