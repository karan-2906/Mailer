"use client"
import { useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";


export default function Home() {
  const [senderMail, setSenderMail] = useState("");
  const [receiverMail, setReceiverMail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const key = process.env.API_KEY

  const sendMail = async () => {
    // console.log("sending")
    const response = await axios.post("/api/sendMail", {
      senderMail,
      receiverMail,
      subject,
      message,
      senderName: senderName,
      receiverName,
    });
    console.log(response.data.message);
    console.log(response.data.mongo)
    if (response.data.message === "sending") {
      toast.success("Mail Sent")
    } else {
      toast.error("Mail Not Sent")
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted")
    sendMail();
  };

  return (
    <div className="text-center m-auto pt-[10%] ">
      <p className="font-bold text-5xl pb-10">Welcome to Mailer </p>
      <form className="flex flex-col gap-5 mx-auto w-1/2 items-center text-black" onSubmit={handleSubmit}>
        <input type="text" className="p-2 placeholder:text-gray-700 w-full" placeholder="Sender Name" onChange={(e) => setSenderName(e.target.value)} />
        <input type="email" className="p-2 placeholder:text-gray-700 w-full" placeholder="Sender Email" onChange={(e) => setSenderMail(e.target.value)} />
        <input type="text" className="p-2 placeholder:text-gray-700 w-full" placeholder="Receiver Name" onChange={(e) => setReceiverName(e.target.value)} />
        <input type="email" className="p-2 placeholder:text-gray-700 w-full" placeholder="Receiver Email" onChange={(e) => setReceiverMail(e.target.value)} />
        <input type="text" className="p-2 placeholder:text-gray-700 w-full" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
        <textarea placeholder="Message" rows={3} className="p-2 placeholder:text-gray-700 col-span-2 w-full" onChange={(e) => setMessage(e.target.value)} />
        <button type="submit" className="bg-blue-600 p-2 w-fit px-20 hover:bg-blue-950">Send Mail</button>
      </form>
    </div>
  );
}
