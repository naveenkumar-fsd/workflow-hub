import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { NotificationProvider } from "@/contexts/NotificationContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import MyRequests from "./pages/MyRequests";
import Approvals from "./pages/Approvals";
import Analytics from "./pages/Analytics";
import Workflows from "./pages/Workflows";
import AuditLogs from "./pages/AuditLogs";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Sonner />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes - Any authenticated user */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Employee + Admin */}
              <Route
                path="/create-request"
                element={
                  <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
                    <CreateRequest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-requests"
                element={
                  <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
                    <MyRequests />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only */}
              <Route
                path="/approvals"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Approvals />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/all-requests"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Approvals />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Users />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/workflows"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Workflows />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sla-settings"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
