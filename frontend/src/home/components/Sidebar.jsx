import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiLogOut } from "react-icons/bi";
import { FaSearch } from 'react-icons/fa';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userConversation from '../../Zustans/useConversation';
import { useAuth } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
    const { onlineUser, socket } = useSocketContext();

    const nowOnline = chatUser.map((user) => (user._id));
    //chats function
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setNewMessageUsers(newMessage)
        })
        return () => socket?.off("newMessage");
    }, [socket, messages])

    //show user with whom you chatted
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])

    //show user from the search result
    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    //show which user is selected
    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSetSelectedUserId(user._id);
        setNewMessageUsers('')
    }

    //back from search result
    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }

    //logout
    const handelLogOut = async () => {

        const confirmlogout = window.prompt("Please type your username to LOGOUT:");
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message);
                }
                toast.info(data?.message)
                localStorage.removeItem('chatapp')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.info("LogOut Cancelled: Username does not match.")
        }

    }

    return (
        <div className='h-full w-full flex flex-col p-4 text-gray-200 bg-gray-900'>
            <div className='flex justify-between items-center gap-3 mb-4'>
                <form onSubmit={handelSearchSubmit} className='flex-1 flex items-center bg-gray-800/80 border border-gray-700/50 rounded-xl overflow-hidden'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='flex-1 px-4 py-2.5 bg-transparent outline-none text-gray-200 placeholder-gray-500 text-sm'
                        placeholder='Search user...'
                    />
                    <button type='submit' className='px-4 py-2.5 bg-purple-700 hover:bg-purple-800 transition-colors'>
                        <FaSearch className='text-white' />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='h-12 w-12 rounded-full border-2 border-purple-600 hover:scale-110 cursor-pointer transition-transform object-cover shadow-lg' 
                    alt='Profile'
                />
            </div>
            <div className='h-px bg-gray-700/50 mb-4'></div>
            {searchUser?.length > 0 ? (
                <>
                    <div className="flex-1 overflow-y-auto scrollbar">
                        <div className='space-y-1'>
                            {searchUser.map((user, index) => (
                                <div
                                    key={user._id}
                                    onClick={() => handelUserClick(user)}
                                    className={`flex gap-3 items-center rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                                        selectedUserId === user?._id 
                                            ? 'bg-purple-700/30 border border-purple-600/50' 
                                            : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30'
                                    }`}
                                >
                                    <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                        <div className="w-12 rounded-full border-2 border-purple-500">
                                            <img src={user.profilepic} alt='user.img' className='object-cover' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col flex-1'>
                                        <p className='font-semibold text-white'>{user.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='mt-4 pt-4 border-t border-gray-700/50'>
                        <button onClick={handSearchback} className='w-full flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 rounded-xl p-2 transition-colors'>
                            <IoArrowBackSharp size={20} className='text-white' />
                            <span className='text-white text-sm font-medium'>Back</span>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto scrollbar">
                        <div className='space-y-1'>
                            {chatUser.length === 0 ? (
                                <div className='flex flex-col items-center justify-center h-full text-center p-4'>
                                    <p className='text-xl font-bold text-purple-300 mb-2'>Looking for someone to talk to?🤔</p>
                                    <p className='text-gray-300'>Search for a username to begin a conversation</p>
                                </div>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div
                                            key={user._id}
                                            onClick={() => handelUserClick(user)}
                                            className={`flex gap-3 items-center rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                                                selectedUserId === user?._id 
                                                    ? 'bg-purple-500/20 border border-purple-500/50' 
                                                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                            }`}
                                        >
                                            <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                                <div className="w-12 rounded-full border-2 border-purple-500">
                                                    <img src={user.profilepic} alt='user.img' className='object-cover' />
                                                </div>
                                            </div>
                                            <div className='flex flex-col flex-1'>
                                                <p className='font-semibold text-white'>{user.username}</p>
                                            </div>
                                            <div>
                                                {newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId === user._id ? (
                                                    <div className="rounded-full bg-green-500 text-xs text-white px-2 py-1 font-semibold">+1</div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='mt-4 pt-4 border-t border-gray-700/50'>
                        <button onClick={handelLogOut} className='w-full flex items-center justify-center gap-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800/50 rounded-xl p-2 transition-colors'>
                            <BiLogOut size={20} className='text-red-400' />
                            <span className='text-red-400 text-sm font-medium'>Logout</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar;
