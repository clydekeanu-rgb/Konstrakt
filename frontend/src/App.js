import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/auth/AuthContext";
import RequireSubscription from "@/auth/RequireSubscription";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Pricing from "@/pages/Pricing";
<<<<<<< HEAD
=======
import ForgotPassword from "@/pages/ForgotPassword";
import UpdatePassword from "@/pages/UpdatePassword";
>>>>>>> 9a99d29858d4e1a91ddcfbb56bc3cdd87750566c
import Dashboard from "@/pages/Dashboard";
import ProjectWorkspace from "@/pages/ProjectWorkspace";

function App() {
  return (
    <div className="App font-body">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
<<<<<<< HEAD
=======
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
>>>>>>> 9a99d29858d4e1a91ddcfbb56bc3cdd87750566c
            <Route
              path="/dashboard"
              element={
                <RequireSubscription>
                  <Dashboard />
                </RequireSubscription>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <RequireSubscription>
                  <Dashboard />
                </RequireSubscription>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <RequireAuth>
                  <ProjectWorkspace />
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="bottom-right" theme="light" richColors />
    </div>
  );
}

export default App;
