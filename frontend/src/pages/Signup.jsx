import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

const Signup = () => {
  const { signup, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const result = await signup(name, email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  const handleGoogle = async (cred) => {
    const result = await googleLogin(cred.credential);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="card p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-display font-bold text-ink">Create Account</h2>
          <p className="text-ink/50 mt-2">Join your peers on PeerLearn.</p>
        </div>

        {error && (
          <div className="bg-stamp/10 text-stamp p-3 rounded-sm mb-4 text-sm font-medium border border-stamp/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Full Name</label>
            <input type="text" required className="input-field" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Email</label>
            <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Password</label>
            <input type="password" required className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full mt-2">Create Account</button>
        </form>

        <div className="flex items-center space-x-2 mb-6">
          <span className="h-px bg-rule flex-1"></span>
          <span className="text-ink/40 text-sm font-medium">OR</span>
          <span className="h-px bg-rule flex-1"></span>
        </div>

        <div className="flex justify-center mb-6">
          <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google Sign-In failed')} />
        </div>

        <p className="text-center text-sm text-ink/60">
          Already have an account? <Link to="/login" className="font-semibold text-chalk hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
