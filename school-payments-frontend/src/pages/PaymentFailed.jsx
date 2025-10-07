export default function PaymentFailed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
      <p className="text-gray-600 mb-6">Something went wrong with your payment.</p>
      <a
        href="/dashboard"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
