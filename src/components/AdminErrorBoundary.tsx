import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Admin panel error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const navigate = useNavigate();
      const location = useLocation();
      
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#060a14] text-white">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0d1526] border border-red-500/20 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black mb-2 font-display">
              {this.props.fallbackTitle || "Admin Panel Error"}
            </h1>
            <p className="text-white/40 text-sm mb-6 font-body">
              {this.props.fallbackMessage || this.state.error?.message || "An unexpected error occurred in the admin panel."}
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/25 cursor-pointer font-display"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer font-display"
              >
                <Home className="w-4 h-4" /> Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for hooks
interface AdminErrorBoundaryWrapperProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export const AdminErrorBoundaryWrapper: React.FC<AdminErrorBoundaryWrapperProps> = ({ 
  children, 
  fallbackTitle, 
  fallbackMessage 
}) => {
  return (
    <AdminErrorBoundary fallbackTitle={fallbackTitle} fallbackMessage={fallbackMessage}>
      {children}
    </AdminErrorBoundary>
  );
};

export default AdminErrorBoundary;