import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Server, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(username, password);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10"></div>
      <div className="glass-panel rounded-2xl w-full max-w-md p-8 animate-slide-up">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/20 p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Server className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-zinc-400 text-center mb-8">Sign in to manage your Bedrock servers</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Username" 
              className="input-field pl-12"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field pl-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary flex items-center justify-center gap-2 group">
            Sign In
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="text-center mt-6 text-zinc-400">
          Don't have an account? <Link to="/register" className="text-primary hover:text-primary-hover font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
