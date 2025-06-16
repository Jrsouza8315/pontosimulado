import { Routes, Route, Navigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import SimulatedExams from "./pages/SimulatedExams";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!session ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!session ? <Register /> : <Navigate to="/" />}
      />

      <Route element={<Layout session={session} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/simulated-exams" element={<SimulatedExams />} />
        <Route
          path="/admin"
          element={
            session?.user?.email === "hbrcomercialssa@gmail.com" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
