
import React, { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Plus, FilterX, ChevronDown, Filter, Users } from 'lucide-react';
import AddClientModal from '../components/AddClientModal';
import ClientDetailsModal from '../components/ClientDetailsModal';
import { Client, SubscriptionPlan } from '../types';
import FindClientsModal from '@/components/FindClientsModal';
import { cancelSubscriptionAPI, markSubscriptionPaidAPI, pauseSubscriptionAPI, resumeSubscriptionAPI } from '@/services/allApi';

interface ClientsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  plans: SubscriptionPlan[];
  refreshClients: () => void
}

const Clients: React.FC<ClientsProps> = ({ clients, setClients, plans, refreshClients }) => {

  const navigate = useNavigate()

  console.log(clients)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFindClientModalOpen, setIsFindClientModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('All Plans');

  const [selectedExistingClient, setSelectedExistingClient] = useState<any | null>(null)

  const selectedClient = useMemo(() =>
    clients.find(c => c.id === selectedClientId) || null
    , [clients, selectedClientId]);

  const handleClientClick = (client: Client) => {
    setSelectedClientId(client.id);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleAddClient = (newClient: Client) => {
    refreshClients()
  };

  // const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, clientId: string) => {
  //   e.stopPropagation();
  //   const newStatus = e.target.value;
  //     try {
  //   await updateClientStatusAPI(clientId, { status: newStatus });

  //   // re-fetch from backend
  //   refreshClients();

  // } catch {
  //   console.log("Failed to update status");
  // };

  const filteredClients = useMemo(() => {

    const term = searchTerm.toLowerCase();

    return clients.filter(client => {

      const planName = client.planName?.toLowerCase() || ''

      const matchesSearch =
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.company?.toLowerCase().includes(term) ||
        planName.includes(term);

      const matchesPlan =
        planFilter === 'All Plans' || client.planId === planFilter;

      return matchesSearch && matchesPlan;

    });

  }, [searchTerm, planFilter, clients]);

  const getStatusBadgeStyles = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'bg-[#0ea5e9] text-white';
      case 'paused': return 'bg-[#f59e0b] text-white';
      case 'cancelled': return 'bg-[#ef4444] text-white';
      case 'pending': return 'bg-[#eab308] text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPlanFilter('All Plans');
  };


  const handleExistingClientSelect = (user: any) => {
    setSelectedExistingClient(user)
    setIsFindClientModalOpen(false)
    setIsAddModalOpen(true)
  }

  return (
    <div className="space-y-6">

      {/* HEADINGS + ADD CLIENT BUTTON */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Users</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage and track your user accounts.</p>
        </div>
        <div className="flex justify-between w-1/4 ">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0ea5e9] hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg"
          >
            <Plus size={18} />
            New Client
          </button>
          <button
            className="bg-[#0ea5e9] hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg"
            onClick={() => { setIsFindClientModalOpen(true) }}>
            <Users />
            Find Client
          </button>
        </div>
      </div>

      {/* SEARCH BOX + FILTER BY PLAN */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by name, email or plan..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 shadow-sm transition-all"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-slate-400" />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500/10 shadow-sm transition-all cursor-pointer"
            >
              <option value="All Plans">All Plans</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {(searchTerm !== '' || planFilter !== 'All Plans') && (
            <button
              onClick={resetFilters}
              className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-xl transition-colors shadow-sm"
              title="Clear Filters"
            >
              <FilterX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* CLIENTS DETAIL TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-visible shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest">
                Client
              </th>

              <th className="px-8 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest text-center">
                Status
              </th>

              <th className="px-8 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest text-center">
                Subscription
              </th>

              <th className="px-8 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">

            {filteredClients.length > 0 ? (

              filteredClients.map((client) => (

                <tr
                  key={client.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => handleClientClick(client)}
                >

                  {/* CLIENT */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">

                      <div className="w-10 h-10 rounded-full border-2 border-[#bae6fd] flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                        {client.avatar ? (
                          <img src={client.avatar} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-[#0ea5e9] rounded-full"></div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                          {client.name}
                        </span>

                        <span className="text-[12px] text-slate-400 font-medium">
                          {client.email}
                        </span>
                      </div>

                    </div>
                  </td>


                  {/* STATUS */}
                  <td className="px-8 py-6 text-center">

                    <span
                      className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-wider ${getStatusBadgeStyles(client.status)}`}
                    >
                      {client.status}
                    </span>

                  </td>


                  {/* PLAN */}
                  <td className="px-8 py-6 text-center">

                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {client.planName}
                    </span>

                  </td>


                  {/* ACTIONS */}
                  <td
                    className="px-8 py-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <div className="flex justify-center gap-2 flex-wrap">

                      {client.status === "pending" && (
                        <button
                          onClick={async () => {
                            console.log("SUB ID SENT:", client.subscriptionId)
                            await markSubscriptionPaidAPI(client.subscriptionId)
                            refreshClients()
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg"
                        >
                          Mark Paid
                        </button>
                      )}

                      {client.status === "active" && (
                        <button
                          onClick={async () => {
                            console.log("Sub ID:", client.subscriptionId)
                            await pauseSubscriptionAPI(client.subscriptionId)
                            refreshClients()
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-lg"
                        >
                          Pause
                        </button>
                      )}

                      {client.status === "paused" && (
                        <button
                          onClick={async () => {
                            console.log("SUB ID SENT:", client.subscriptionId)
                            await resumeSubscriptionAPI(client.subscriptionId)
                            refreshClients()
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg"
                        >
                          Resume
                        </button>
                      )}

                      {(client.status === "active" || client.status === "paused") && (
                        <button
                          onClick={async () => {
                            await cancelSubscriptionAPI(client.subscriptionId)
                            refreshClients()
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
                        >
                          Cancel
                        </button>
                      )}

                      {client.status === "cancelled" && (
                        <div className="relative group">

                          <button className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-1">
                            Restart
                            <ChevronDown size={12} />
                          </button>

                          <div className="absolute hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-md rounded-lg mt-1 z-50">

                            <button
                              onClick={() =>
                                navigate(`/cash-pay?subId=${client.subscriptionId}`)
                              }
                              className="px-4 py-2 text-xs hover:bg-slate-100 text-left"
                            >
                              Cash
                            </button>

                            <button
                              onClick={() =>
                                navigate(`/online-pay?subId=${client.subscriptionId}`)
                              }
                              className="px-4 py-2 text-xs hover:bg-slate-100 text-left"
                            >
                              Online
                            </button>

                          </div>

                        </div>
                      )}

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">

                  <div className="flex flex-col items-center justify-center opacity-40">

                    <FilterX size={48} className="text-slate-400 mb-2" />

                    <p className="text-sm font-bold text-slate-500 italic uppercase tracking-widest">
                      No matching clients found
                    </p>

                  </div>

                </td>
              </tr>

            )}

          </tbody>
        </table>
      </div>

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setSelectedExistingClient(null); }}
        onAdd={handleAddClient}
        plans={plans}
        refreshClients={refreshClients}
        existingClient={selectedExistingClient}
      />
      {selectedClient && (
        <ClientDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          client={selectedClient}
          onUpdate={handleUpdateClient}
          plans={plans}
        />
      )}
      {isFindClientModalOpen && (
        <FindClientsModal
          isOpen={isFindClientModalOpen}
          onClose={() => setIsFindClientModalOpen(false)}
          onSelectUser={handleExistingClientSelect}
        />
      )}
    </div>
  );
};

export default Clients;
