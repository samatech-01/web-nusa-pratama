import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth, formatApiErrorDetail } from "@/context/AuthContext";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2b2b] flex items-center justify-center px-4 font-body">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/images/logo_mark.png" alt="Logo" className="h-14 mb-4" />
          <h1 className="font-heading font-bold text-2xl text-[#2b2b2b]">Admin Login</h1>
          <p className="text-sm text-[#9a9a9a] mt-1">PT Nusa Pratama Solution</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              data-testid="admin-login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:border-[#F5A742]"
              placeholder="admin@..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              data-testid="admin-login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:border-[#F5A742]"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p data-testid="admin-login-error" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            data-testid="admin-login-submit"
            disabled={loading}
            className="w-full bg-[#F5A742] hover:bg-[#e0942f] text-white font-semibold py-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <Lock size={16} />
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
