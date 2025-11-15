import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const [userInput, setUserInput] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handelInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]: e.target.value
        });
    };

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const login = await axios.post(`/api/auth/login`, userInput);
            const data = login.data;
            if (data.success === false) {
                setLoading(false);
                console.log(data.message);
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
            localStorage.setItem('chatapp', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className='fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden'>
            {/* Animated background elements */}
            <div className='absolute inset-0 w-full h-full overflow-hidden'>
                <div className='absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob'></div>
                <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000'></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative z-10 w-full max-w-md mx-4 px-4 py-8'
            >
                <div className='bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-5 shadow-lg'
                        >
                            <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                        </motion.div>
                        <h1 className='text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'>Welcome Back</h1>
                        <p className='text-gray-300 text-base'>Sign in to continue to SnapTalk</p>
                    </div>

                    <form onSubmit={handelSubmit} className='space-y-5'>
                        {/* Email Input */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-200 mb-2.5' htmlFor='email'>
                                Email Address
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Mail className='h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors' />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    value={userInput.email}
                                    onChange={handelInput}
                                    placeholder='you@example.com'
                                    required
                                    className='w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 hover:border-white/20'
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-200 mb-2.5' htmlFor='password'>
                                Password
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Lock className='h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors' />
                                </div>
                                <input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={userInput.password}
                                    onChange={handelInput}
                                    placeholder='Enter your password'
                                    required
                                    className='w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 hover:border-white/20'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors'
                                >
                                    {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className='flex items-center justify-end pt-1'>
                            <Link to='/forgot' className='text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors'>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/30 mt-6'
                        >
                            {loading ? (
                                <span className='flex items-center justify-center'>
                                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className='mt-8 text-center pt-6 border-t border-white/10'>
                        <p className='text-sm text-gray-300'>
                            Don't have an account?{' '}
                            <Link to={'/register'} className='font-semibold text-purple-400 hover:text-purple-300 transition-colors underline decoration-2 underline-offset-2'>
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}

export default Login;
