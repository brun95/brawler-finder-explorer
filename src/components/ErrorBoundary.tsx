'use client'

import React from 'react'

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return (
                <FallbackComponent
                    error={this.state.error}
                    reset={() => this.setState({ hasError: false, error: undefined })}
                />
            );
        }

        return this.props.children;
    }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-gray-200 rounded-lg p-6 border border-red-600/20">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-4">
                        We're sorry, but an unexpected error occurred.
                    </p>
                    {error && (
                        <details className="text-left mb-4">
                            <summary className="text-gray-700 cursor-pointer hover:text-gray-900">
                                Error details
                            </summary>
                            <pre className="text-sm text-red-400 mt-2 p-2 bg-gray-100 rounded overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                    <div className="space-y-2">
                        <button
                            onClick={reset}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Try again
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Go home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}