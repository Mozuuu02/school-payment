import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const status = searchParams.get("status");
      const requestId = searchParams.get("EdvironCollectRequestId");

      if (!requestId) {
        console.error("❌ Missing EdvironCollectRequestId");
        navigate("/payment-failed");
        return;
      }

      try {
        // ✅ Always verify payment, including failed ones
        await api.post("/payments/verify", {
          EdvironCollectRequestId: requestId,
          manualStatus: status, // 👈 new line — tells backend user’s selected status
        });

        const normalizedStatus = status?.toLowerCase();

        if (normalizedStatus === "success") {
          navigate("/dashboard");
        } else if (normalizedStatus === "fail" || normalizedStatus === "failed") {
          navigate("/payment-failed");
        } else {
          console.warn("⚠️ Unknown status:", status);
          navigate("/payment-failed");
        }
      } catch (err) {
        console.error("❌ Payment verification failed:", err);
        navigate("/payment-failed");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
      <p className="text-gray-600">Please wait while we confirm your payment status.</p>
    </div>
  );
}
