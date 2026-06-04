"use client"

import { useState, type SyntheticEvent } from 'react';

export default function LoginPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError('');
        setMessage('');

        const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
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
            if(data.name){
                localStorage.setItem('userName', data.name)
            }

            setRedirecting(true);
            setTimeout(() => {
                window.location.href = "/"; // or use router.push("/") if using Next.js router
            }, 2000);

            //reset form
            setEmail('');
            setPassword('');
            setName('');


        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
                {isSignup && (<input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setName(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                />)}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Plese wait..' : isSignup ? 'Sign Up' : 'Login'}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    <span className="text-blue-500 cursor-pointer" onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? ' Login' : ' Sign Up'}
                    </span>
                </p>
                {message && <p className="mt-2 text-green-500">{message}</p>}
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </form>

            {redirecting && (
                <div className="flex justify-center mt-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

        </div>
    );

}