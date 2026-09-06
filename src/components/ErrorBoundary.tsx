import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0b16] text-white">
          <div className="max-w-md w-full p-8 rounded-3xl bg-gray-900/80 border border-red-500/20 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {this.state.error?.message || "An unexpected error occurred in the application."}
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25 cursor-pointer"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <Home className="w-4 h-4" /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
