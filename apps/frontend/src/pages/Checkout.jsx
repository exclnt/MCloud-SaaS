import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  CreditCard,
  Server,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-YOUR_CLIENT_KEY");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const data = await api.checkout(50000);

      window.snap.pay(data.token, {
        onSuccess: function (result) {
          setSuccess(true);
          setTimeout(() => navigate("/dashboard"), 3000);
        },
        onPending: function (result) {
          console.log("pending", result);
        },
        onError: function (result) {
          console.error("error", result);
          setLoading(false);
        },
        onClose: function () {
          setLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10"></div>
        <div className="glass-panel p-12 rounded-3xl text-center max-w-md animate-slide-up">
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-zinc-400 mb-8">
            Your server is being automatically provisioned. You will be
            redirected shortly.
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background -z-10"></div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 md:p-12 rounded-3xl animate-slide-up">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Bedrock Local MVP Server
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  1 Month Subscription • 2GB RAM • UDP Port Access
                </p>
                <div className="inline-flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <span className="text-primary font-bold">IDR 50.000</span>
                  <span className="text-zinc-500 text-xs">/mo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Includes:</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Automated
                Provisioning via Docker
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Dynamic Port
                Allocation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Full Lifecycle
                Control (Start/Stop/Restart)
              </li>
            </ul>
          </div>
        </div>

        <div
          className="flex items-center justify-center animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-white text-center md:text-left">
              Complete Purchase
            </h2>
            <p className="text-zinc-400 mb-8 text-center md:text-left">
              Secure payment processing powered by Midtrans. By confirming, you
              agree to our terms of service.
            </p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary !py-4 flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <CreditCard className="w-6 h-6" />
              )}
              {loading ? "Processing..." : "Pay IDR 50.000"}
            </button>

            <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
              <span className="text-xs text-zinc-600 uppercase tracking-widest font-semibold">
                Protected by Midtrans Sandbox
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
