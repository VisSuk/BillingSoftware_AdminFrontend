import { confirmOnlinePaymentAPI } from '@/services/allApi';
import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";

interface PaymentSuccessProps {
  refreshClients: () => Promise<void>
  refreshInvoices: () => Promise<void>
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ refreshClients, refreshInvoices}) => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const hasConfirmed = useRef(false)

  useEffect(() => {

    const confirmPayment = async () => {

      if (hasConfirmed.current) return
      hasConfirmed.current = true

      const subId = searchParams.get("subId")
      if (!subId) return

      try {

        await confirmOnlinePaymentAPI(subId)
        await refreshClients()
        await refreshInvoices()

      } catch (err) {

        console.log("Payment confirmation failed")

      }

    }

    confirmPayment()

  }, [searchParams])

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center px-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full bg-white shadow-xl rounded-3xl p-10">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center space-y-6">

          <h1 className="text-4xl font-extrabold text-slate-800">
            🎉 Congratulations!
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Your payment was successful. Thank you for subscribing to our
            service. Your subscription has now been activated and you can start
            using all the features immediately.
          </p>

          <button
            onClick={() => navigate("/subscriptions")}
            className="w-fit bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
          >
            Back to Subscriptions
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center">

          <img
            src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif"
            alt="Payment Success"
            className="max-h-[320px] object-contain"
          />

        </div>

      </div>

    </div>
  )
}

export default PaymentSuccess