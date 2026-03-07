import { findClientAPI } from '@/services/allApi'
import { Search, X } from 'lucide-react'
import React, { useState } from 'react'

interface FindClientsModalProps {
    isOpen: boolean,
    onClose: () => void,
    onSelectUser: (user: any) => void
}

const FindClientsModal: React.FC<FindClientsModalProps> = ({ isOpen, onClose, onSelectUser }) => {


    const [hasSearched, setHasSearched] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null
    console.log("onSelectUser:", onSelectUser)

    const fetchSearchedClient = async () => {
        setHasSearched(true)
        if (!searchTerm.trim()) return

        try {
            setLoading(true)
            const res = await findClientAPI(searchTerm)
            setResults(res.data)
            console.log(res.data)
        } catch (error) {
            console.log("Search failed")
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                <div className="bg-[#f0f9ff] w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all border border-sky-100">
                    <div className="p-8 pb-4 flex justify-between items-start">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Find existing clients</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1"><X size={24} /></button>
                    </div>

                    <div className="px-8 pb-4 flex gap-2">
                        <input className="w-full rounded-xl px-2 py-2" type="text" placeholder="Enter mobile or email"
                            onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />
                        <button onClick={fetchSearchedClient} className="bg-sky-500 text-white px-3 py-2 rounded-xl">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="px-8 pb-8 max-h-64 overflow-y-auto space-y-3">

                        {loading && (
                            <p className="text-sm text-slate-500">Searching...</p>
                        )}

                        {!loading && hasSearched && results.length === 0 && (
                            <p className="text-sm text-slate-400">
                                No users found
                            </p>
                        )}

                        {results.map((item: any) => (
                            <div
                                key={item.user?._id}
                                onClick={() => onSelectUser(item.user)}
                                className="bg-white p-4 rounded-xl border border-sky-100 cursor-pointer hover:bg-sky-50 transition-all"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800">
                                            {item.user.fullname}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {item.user.email}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {item.user.mobile}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}

export default FindClientsModal