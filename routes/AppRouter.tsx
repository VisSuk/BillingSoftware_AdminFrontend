
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import Subscriptions from '../pages/Subscriptions';
import Invoices from '../pages/Invoices';
import CashPayByHand from '../pages/CashPayByHand';
import AutopayProcessor from '../pages/AutopayProcessor';
import Login from '../pages/Login';
import { Client, SubscriptionPlan, Invoice, User } from '../types';
import { fetchClientsAPI, getAllPaymentsAPI, plansAPI } from '@/services/allApi';

const AppRouter: React.FC = () => {
  // Use localStorage to persist login state for the demo
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // return localStorage.getItem('nexus_auth') === 'true';
    return !!localStorage.getItem('admin_token')
  });

  const handleLogin = (user: User, token: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user))
    setCurrentUser(user)
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user')
  };

  // Global Admin User State
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    avatar: undefined,
  });

  // FUNCTION - Fetch company plans
  const fetchCompanyPlans = async () => {
    try {
      const fetchPlansResponse = await plansAPI()
      // console.log(fetchPlansResponse.data)
      setPlans(fetchPlansResponse.data)
    } catch (error) {
      console.log("Failed to fetch plans")
    }
  }

  // FUNCTION - Fetch company clients
  const fetchCompanyClients = async () => {
    try {
      const res = await fetchClientsAPI()
      setClients(res.data)
      // console.log(res.data)
    } catch {
      console.log("Failed to fetch clients")
    }
  }

  const fetchInvoices = async () => {
    try {
      const res = await getAllPaymentsAPI()
      // console.log(res.data)
      const formatted = res.data.map((p: any) => ({
        id: p.invoiceId,
        clientName: p.userId?.fullname,
        clientEmail: p.userId?.email,
        status: p.status === "paid" ? "Paid" : "Pending",
        issueDate: new Date(p.createdAt).toLocaleDateString(),
        expiryDate: p.expiryDate
          ? new Date(p.expiryDate).toLocaleDateString()
          : "-",
        amount: p.amount,
        description: p.subscriptionTierId?.name,
        paymentMethod: p.paymentMethod
      }))

      setInvoices(formatted)

    } catch (err) {
      console.log("Failed to fetch invoices")
    }
  }

  // Master State for Subscription Plans
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  // Master State for Clients
  const [clients, setClients] = useState<Client[]>([]);

  // Master State for Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const storedUser = localStorage.getItem('admin_user')

    if (storedUser) {
      const userDetails = JSON.parse(storedUser)
      setCurrentUser({
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        avatar: userDetails.avatar || undefined
      })
    }
    if (token) {
      fetchCompanyPlans()
      fetchCompanyClients()
      fetchInvoices()
    }
  }, [isAuthenticated])

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login onLoginSuccess={handleLogin} /> : <Navigate to="/" />}
      />

      <Route
        path="/"
        element={isAuthenticated ? <Layout user={currentUser} setUser={setCurrentUser} plans={plans} onLogout={handleLogout} /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard clients={clients} invoices={invoices} />} />
        <Route
          path="clients"
          element={<Clients clients={clients} setClients={setClients} plans={plans} refreshClients={fetchCompanyClients} />}
        />
        <Route
          path="subscriptions"
          element={<Subscriptions plans={plans} refreshPlans={fetchCompanyPlans} />}
        />
        <Route
          path="invoices"
          element={<Invoices invoices={invoices} setInvoices={setInvoices} clients={clients} />}
        />
        <Route path="cash-pay" element={<CashPayByHand clients={clients} refreshClients={fetchCompanyClients}  refreshInvoices={fetchInvoices} />} />
        <Route path="autopay" element={<AutopayProcessor clients={clients} setClients={setClients} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
