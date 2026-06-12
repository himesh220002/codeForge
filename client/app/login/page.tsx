//client/app/login/page.tsx
"use client"

import { useState, useEffect, type SyntheticEvent } from 'react';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        // Clear message and error when toggling form mode
        setError('');
        setMessage('');
    }, [isSignup]);

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!email || !password || (isSignup && !name)) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        const endpoint = isSignup ? '/codeforge/api/auth/signup' : '/codeforge/api/auth/login';
        const body = isSignup ? { email, password, name } : { email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                setLoading(false);
                return;
            }

            // set success message and store token if available
            setMessage(data.message || (isSignup ? 'Signup successful! Please log in.' : 'Login successful!'));
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }
            if (data.name) {
                localStorage.setItem('userName', data.name);
            }

            setRedirecting(true);
            setTimeout(() => {
                window.location.href = "/codeforge";
            }, 1500);

            //reset form
            setEmail('');
            setPassword('');
            setName('');

        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-indigo-500/10 rounded-2xl p-8 shadow-2xl relative z-10 transition-all">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group focus:outline-none">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            CF
                        </div>
                        <span className="text-lg font-bold tracking-wider text-slate-100 group-hover:text-white transition-colors">
                            CodeForge
                        </span>
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                        {isSignup ? 'Create your account' : 'Sign in to platform'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1.5">
                        {isSignup ? 'Get started with your developer dashboard' : 'Enter details to access your profile'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                    <UserIcon size={16} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-950/70 border border-indigo-500/10 rounded-xl text-slate-155 placeholder-gray-655 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/80 transition-all text-sm"
                                    disabled={loading || redirecting}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-950/70 border border-indigo-500/10 rounded-xl text-slate-155 placeholder-gray-655 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/80 transition-all text-sm"
                                disabled={loading || redirecting}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-950/70 border border-indigo-500/10 rounded-xl text-slate-155 placeholder-gray-655 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/80 transition-all text-sm"
                                disabled={loading || redirecting}
                            />
                        </div>
                    </div>

                    {/* Alerts */}
                    {message && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl animate-in fade-in duration-200">
                            <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
                            <span>{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl animate-in fade-in duration-200">
                            <AlertCircle size={16} className="shrink-0 text-red-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || redirecting}
                        className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-blue-500/15 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Please wait...</span>
                            </>
                        ) : redirecting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Redirecting...</span>
                            </>
                        ) : (
                            <>
                                <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer toggle link */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        className="text-blue-400 font-bold hover:underline ml-1 cursor-pointer focus:outline-none"
                        onClick={() => setIsSignup(!isSignup)}
                        disabled={loading || redirecting}
                    >
                        {isSignup ? 'Sign In' : 'Create one'}
                    </button>
                </p>

            </div>
        </div>
    );
}