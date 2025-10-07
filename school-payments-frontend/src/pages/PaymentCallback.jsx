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

      if (status === "SUCCESS" && requestId) {
        try {
          await api.post("/payments/verify", { EdvironCollectRequestId: requestId });
          navigate("/dashboard");
        } catch (err) {
          console.error("❌ Payment verification failed:", err);
          navigate("/payment-failed");
        }
      } else {
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
