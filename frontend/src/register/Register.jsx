import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AtSign } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        confpassword: '',
        gender: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handelInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        });
    };

    const selectGender = (gender) => {
        setInputData((prev) => ({
            ...prev, gender: prev.gender === gender ? '' : gender
        }));
    };

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (inputData.password !== inputData.confpassword) {
            setLoading(false);
            return toast.error("Passwords don't match");
        }
        try {
            const register = await axios.post(`/api/auth/register`, inputData);
            const data = register.data;
            if (data.success === false) {
                setLoading(false);
                toast.error(data.message);
                console.log(data.message);
                return;
            }
            toast.success(data?.message);
            localStorage.setItem('chatapp', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
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

            <div className='relative z-10 w-full max-w-md mx-4 px-4 py-2'>
                <div className='bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-5 md:p-6'>
                    {/* Header */}
                    <div className='text-center mb-4'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3 shadow-lg'>
                            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
                            </svg>
                        </div>
                        <h1 className='text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'>Create Account</h1>
                        <p className='text-gray-300 text-sm'>Join SnapTalk and start chatting</p>
                    </div>

                    <form onSubmit={handelSubmit} className='space-y-3'>
                        {/* Full Name */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-200 mb-1.5' htmlFor='fullname'>
                                Full Name
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <User className='h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors' />
                                </div>
                                <input
                                    id='fullname'
                                    type='text'
                                    value={inputData.fullname}
                                    onChange={handelInput}
                                    placeholder='John Doe'
                                    required
                                    className='w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 hover:border-white/20 text-sm'
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-200 mb-1.5' htmlFor='username'>
                                Username
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <AtSign className='h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors' />
                                </div>
                                <input
                                    id='username'
                                    type='text'
                                    value={inputData.username}
                                    onChange={handelInput}
                                    placeholder='johndoe'
                                    required
                                    className='w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 hover:border-white/20 text-sm'
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-200 mb-1.5' htmlFor='email'>
                                Email Address
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className='h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors' />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    value={inputData.email}
                                    onChange={handelInput}
                                    placeholder='you@example.com'
                                    required
                                    className='w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 hover:border-white/20 text-sm'
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-200 mb-1.5' htmlFor='password'>
                                Password
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors' />
                                </div>
                                <input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={inputData.password}
                                    onChange={handelInput}
                                    placeholder='Enter password'
                                    required
                                    className='w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 hover:border-white/20 text-sm'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors'
                                >
                                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-200 mb-1.5' htmlFor='confpassword'>
                                Confirm Password
                            </label>
                            <div className='relative group'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors' />
                                </div>
                                <input
                                    id='confpassword'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={inputData.confpassword}
                                    onChange={handelInput}
                                    placeholder='Confirm password'
                                    required
                                    className='w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 hover:border-white/20 text-sm'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors'
                                >
                                    {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                                </button>
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-200 mb-2'>Gender</label>
                            <div className='flex gap-2'>
                                <button
                                    type='button'
                                    onClick={() => selectGender('male')}
                                    className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                                        inputData.gender === 'male'
                                            ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-purple-400/50 hover:bg-white/10'
                                    }`}
                                >
                                    Male
                                </button>
                                <button
                                    type='button'
                                    onClick={() => selectGender('female')}
                                    className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                                        inputData.gender === 'female'
                                            ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-purple-400/50 hover:bg-white/10'
                                    }`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4 shadow-lg shadow-purple-500/30 text-sm'
                        >
                            {loading ? (
                                <span className='flex items-center justify-center'>
                                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Redirect */}
                    <div className='mt-4 text-center pt-4 border-t border-white/10'>
                        <p className='text-xs text-gray-300'>
                            Already have an account?{' '}
                            <Link to={'/login'} className='font-semibold text-purple-400 hover:text-purple-300 transition-colors underline decoration-2 underline-offset-2'>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

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

export default Register;
