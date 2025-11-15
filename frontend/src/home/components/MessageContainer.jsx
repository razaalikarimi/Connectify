import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import userConversation from "../../Zustans/useConversation";
import notify from "../../assets/sound/notification.mp3";
import { useAuth } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    selectedConversation,
    setMessage,
    setSelectedConversation,
  } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessage, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);
  console.log(messages);

  const handelMessages = (e) => {
    setSendData(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { messages: sendData }
      );
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSendData("");
      setMessage([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 text-gray-200 bg-gray-900">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-white font-semibold flex flex-col items-center gap-4">
            <p className="text-2xl">Welcome!!👋 {authUser.username}😉</p>
            <p className="text-lg text-gray-300">
              Select a chat to start messaging
            </p>
            <TiMessages className="text-6xl text-center text-white" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center gap-3 bg-gray-800/80 border border-gray-700/50 rounded-xl p-3 mb-4">
            <div className="flex gap-3 items-center w-full">
              <div className="md:hidden">
                <button
                  onClick={() => onBackUser(true)}
                  className="p-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 rounded-lg transition-colors"
                >
                  <IoArrowBackSharp size={20} className="text-white" />
                </button>
              </div>
              <img
                className="rounded-full w-10 h-10 border-2 border-purple-600 object-cover"
                src={selectedConversation?.profilepic}
                alt="Profile"
              />
              <span className="text-white text-lg font-semibold">
                {selectedConversation?.username}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 px-2">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4">
                <div className="loading loading-spinner text-purple-600"></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-400 text-lg">
                  Send a message to start the conversation 💬
                </p>
              </div>
            )}
            {!loading &&
              messages?.length > 0 &&
              messages?.map((message) => (
                <div className="mb-4" key={message?._id} ref={lastMessageRef}>
                  <div
                    className={`flex ${
                      message.senderId === authUser._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.senderId === authUser._id
                          ? "bg-gradient-to-r from-purple-700 to-pink-700 text-white"
                          : "bg-gray-800/80 text-gray-200 border border-gray-700/50"
                      }`}
                    >
                      <p className="text-sm">{message?.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message?.createdAt).toLocaleTimeString(
                          "en-IN",
                          { hour: "numeric", minute: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <form onSubmit={handelSubmit} className="flex gap-2">
            <div className="flex-1 flex items-center bg-gray-800/80 border border-gray-700/50 rounded-xl overflow-hidden">
              <input
                value={sendData}
                onChange={handelMessages}
                required
                id="message"
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
              />
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-3 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 transition-colors disabled:opacity-50"
              >
                {sending ? (
                  <div className="loading loading-spinner loading-sm text-white"></div>
                ) : (
                  <IoSend size={20} className="text-white" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
