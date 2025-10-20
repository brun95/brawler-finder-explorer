'use client'

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-gray-800 rounded-lg p-6 border border-red-600/20">
                    <div className="text-red-500 text-6xl mb-4">💥</div>
                    <h2 className="text-xl font-bold text-gray-100 mb-2">
                        Application Error
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Something went wrong with the application.
                    </p>
                    {error && (
                        <details className="text-left mb-4">
                            <summary className="text-gray-300 cursor-pointer hover:text-gray-100">
                                Error details
                            </summary>
                            <pre className="text-sm text-red-400 mt-2 p-2 bg-gray-900 rounded overflow-auto max-h-32">
                                {error.message}
                                {error.digest && `\nDigest: ${error.digest}`}
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