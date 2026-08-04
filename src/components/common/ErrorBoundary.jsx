import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, this should be sent to a monitoring service.
    console.error("Uncaught error in ErrorBoundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-4">
          <div className="max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl shadow-warm-lg p-8">
            <h1 className="text-3xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4">
              Something went wrong
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
              An unexpected error occurred while loading the page. Please refresh the browser or try again later.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-brand-700 transition"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
