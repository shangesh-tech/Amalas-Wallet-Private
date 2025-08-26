'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { User, Mail, KeyRound, Users } from 'lucide-react';

const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please try again.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                gender: formData.gender,
            });

            // Automatically sign in the user after successful registration
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                // If auto-login fails, redirect to login page for manual sign-in
                router.push('/login');
            } else {
                router.push('/'); // Redirect to homepage on success
            }

        } catch (error) {
            setError(error.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        signIn(provider, { callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#121D33] to-[#1a2847] py-44 px-4">
            <div className="max-w-md w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="bg-gray-900/50 py-6">
                    <h2 className="text-center text-3xl font-bold text-white">
                        Create Your Account
                    </h2>
                    <p className="mt-2 text-center text-blue-300/70">
                        Get started with your Amal Wallet
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-md">
                            <p className="font-medium">Registration Failed</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="First Name" name="firstName" type="text" placeholder="John" value={formData.firstName} onChange={handleChange} icon={<User className="h-5 w-5 text-white/30" />} />
                            <InputField label="Last Name" name="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleChange} icon={<User className="h-5 w-5 text-white/30" />} />
                        </div>

                        <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} icon={<Mail className="h-5 w-5 text-white/30" />} />

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-white/70">
                                Gender
                            </label>
                             <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users className="h-5 w-5 text-white/30" />
                                </div>
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    className="appearance-none focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 border border-white/20 rounded-md text-white placeholder-white/40 bg-white/5"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <InputField label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} icon={<KeyRound className="h-5 w-5 text-white/30" />} />
                        <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} icon={<KeyRound className="h-5 w-5 text-white/30" />} />

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#16223d] text-white/50">
                                    Or sign up with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => handleSocialLogin('google')}
                                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-white/20 rounded-md shadow-sm bg-white/10 text-sm font-medium text-white/80 hover:bg-white/20 transition-all duration-200"
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-white/60">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// A reusable InputField component to keep the form clean
const InputField = ({ label, name, type, placeholder, value, onChange, icon }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-white/70">
            {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                id={name}
                name={name}
                type={type}
                required
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 border border-white/20 rounded-md text-white placeholder-white/40 bg-white/5"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);


export default SignUp;