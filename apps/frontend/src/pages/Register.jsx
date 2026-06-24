import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Server, Lock, User, UserPlus } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.register(username, password);
      // Auto login
      const data = await api.login(username, password);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background -z-10"></div>
      <div className="glass-panel rounded-2xl w-full max-w-md p-8 animate-slide-up">
        <div className="flex justify-center mb-8">
          <div className="bg-secondary/20 p-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Server className="w-10 h-10 text-secondary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-zinc-400 text-center mb-8">Join MCloud to host your worlds</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-5">
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
          <button type="submit" className="btn-primary !bg-secondary !shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:!shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 group">
            Sign Up
            <UserPlus className="w-5 h-5" />
          </button>
        </form>
        
        <p className="text-center mt-6 text-zinc-400">
          Already have an account? <Link to="/login" className="text-secondary hover:text-blue-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
