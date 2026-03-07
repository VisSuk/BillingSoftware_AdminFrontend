import React, { useState, useMemo, useEffect } from 'react'
import { Cpu, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Client } from '../types'
import {
  markSubscriptionPaidAPI,
  getPaidPaymentsAPI
} from '@/services/allApi'

interface CashPayProps {
  clients: Client[]
  refreshClients: () => Promise<void>
  refreshInvoices: () => Promise<void>
}

const CashPayByHand: React.FC<CashPayProps> = ({ clients, refreshClients, refreshInvoices }) => {

  const [selectedClientId, setSelectedClientId] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  const [payments, setPayments] = useState<any[]>([])

  const selectedClient = useMemo(
    () => clients.find(c => c.id === selectedClientId) || null,
    [clients, selectedClientId]
  )

  const fetchPayments = async () => {
    try {
      const res = await getPaidPaymentsAPI()
      setPayments(res.data)
    } catch (err) {
      console.log("Failed to fetch payments")
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [clients])

  useEffect(() => {
  if (selectedClient) {
    setAmount(selectedClient.price)
  } else {
    setAmount('')
  }
}, [selectedClient])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) return

    try {

      setIsUpdating(true)

      await markSubscriptionPaidAPI(selectedClient.subscriptionId)

      setSuccess(true)

      setTimeout(() => setSuccess(false), 2500)

      setSelectedClientId('')
      setAmount('')

      await refreshClients()
      await refreshInvoices()
      await fetchPayments()

    } catch (err: any) {
      console.log("Payment error:", err.response?.data)
    } finally {

      setIsUpdating(false)

    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LEFT SIDE — CASH PAYMENT FORM */}

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-10">

        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Cash Payment
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Record manual cash payments.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleUpdate}>

          {/* CLIENT SELECT */}

          <div className="space-y-1.5">

            <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">
              Client
            </label>

            <div className="relative">

              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-5 py-4 bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl text-sm font-bold appearance-none"
              >

                <option value="">Select a client...</option>

                {clients
                  .filter(c => c.status === "pending")
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}

              </select>

              <ChevronDown
                size={18}
                className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500"
              />

            </div>
          </div>


          {/* AMOUNT + STATUS */}

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1.5">

              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">
                Amount ($)
              </label>

              <input
                type="number"
                value={amount}
                readOnly
                placeholder="0.00"
                className="w-full px-5 py-4 bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl text-sm font-bold"
              />

            </div>

            <div className="space-y-1.5">

              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">
                Current Status
              </label>

              <div className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-500">

                {selectedClient ? selectedClient.status : "---"}

              </div>

            </div>

          </div>


          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={!selectedClientId || !amount ||isUpdating}
            className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-widest ${success
              ? "bg-emerald-500 text-white"
              : "bg-sky-500 hover:bg-sky-600 text-white"
              }`}
          >

            {isUpdating ? (
              <Cpu size={20} className="animate-spin" />
            ) : success ? (
              <CheckCircle2 size={20} />
            ) : (
              <Cpu size={20} />
            )}

            {isUpdating
              ? "Updating..."
              : success
                ? "Payment Recorded"
                : "Record Payment"}

          </button>

        </form>

      </div>



      {/* RIGHT SIDE — CASH PAYMENT HISTORY */}

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-10">

        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">
          Cash Payments
        </h2>

        <div className="overflow-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b border-slate-200 dark:border-slate-700">

                <th className="py-3 text-xs uppercase text-sky-500">Client</th>
                <th className="py-3 text-xs uppercase text-sky-500">Amount</th>
                <th className="py-3 text-xs uppercase text-sky-500">Date</th>

              </tr>

            </thead>

            <tbody>

              {payments.map((p: any) => (

                <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800">

                  <td className="py-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                    {p.userId?.fullname}
                    <div className="text-xs text-slate-400">
                      {p.subscriptionTierId?.name}
                    </div>
                  </td>

                  <td className="py-3 text-sm text-slate-600 dark:text-slate-400">
                    ${p.amount}
                  </td>

                  <td className="py-3 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default CashPayByHand