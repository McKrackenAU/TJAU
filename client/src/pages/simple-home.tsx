import { useAuth } from "@/hooks/use-auth";

export default function SimpleHome() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center" style={{minHeight: '100vh', width: '100vw'}}>
        <div className="text-center text-white p-4">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading Tarot Journey...</p>
          <p className="text-sm opacity-75 mt-2">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Tarot Journey</h1>
          <p className="text-xl mb-8">Welcome to your spiritual journey</p>
          <a 
            href="/auth" 
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg border border-white/30 inline-block transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user.username}!</h1>
        <p className="text-xl mb-8">Your spiritual journey continues...</p>
        <div className="space-y-4">
          <a href="/daily" className="block bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg border border-white/30 transition-colors">
            Daily Reading
          </a>
          <a href="/spreads" className="block bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg border border-white/30 transition-colors">
            Tarot Spreads
          </a>
          <a href="/learning" className="block bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg border border-white/30 transition-colors">
            Learn Tarot
          </a>
        </div>
      </div>
    </div>
  );
}