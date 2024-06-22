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

  const sendMail = async () => {
    console.log("first step")

    // const response = await axios.post("/api/sendMail", {
    //   senderMail,
    //   receiverMail,
    //   subject,
    //   message,
    //   senderName,
    //   receiverName,
    // });
    let response = await fetch('/api/sendMail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderMail,
        receiverMail,
        subject,
        message,
        senderName,
        receiverName
      })
    });
    response = await response.json();
    console.log(response)
    // console.log(response.data.message);
    // console.log("Getting user Details", response.data.mongo)
    // if (response.data.message === "sending" && response.data.status === 201) {
    //   toast.success("Mail Sent")
    // }
    // else if (response.data.status !== 201) {
    //   toast.error("Error in the Data Filled")
    // }
    // else {
    //   toast.error("Error in sending Mail")
    // }
    // console.log("sent")
    // return response.data.status
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted")
    const done = await sendMail();
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
