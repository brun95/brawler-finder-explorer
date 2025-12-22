'use client'

export default function GlobalError({
    error: _error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-gray-200 rounded-lg p-6 border border-red-600/20">
                            <div className="text-red-500 text-6xl mb-4">🔥</div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Critical Error
                            </h2>
                            <p className="text-gray-600 mb-4">
                                A critical error has occurred. Please refresh the page.
                            </p>
                            <div className="space-y-2">
                                <button
                                    onClick={reset}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Reset Application
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}