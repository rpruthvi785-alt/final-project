import { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = filter === 'All' ? payments : payments.filter(p => p.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Refunded': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle size={14} />;
      case 'Pending': return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading payments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Payment Tracking System</h2>
        
        <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
          {['All', 'Paid', 'Pending', 'Failed', 'Refunded'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === status ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--border)] hover:bg-opacity-30'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--border)] bg-opacity-30 border-b border-[var(--border)]">
              <th className="p-4 font-semibold text-sm">User</th>
              <th className="p-4 font-semibold text-sm">Trip Name</th>
              <th className="p-4 font-semibold text-sm">Amount</th>
              <th className="p-4 font-semibold text-sm">Method</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[var(--text-secondary)]">No payments found.</td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)] hover:bg-opacity-10 transition-colors">
                  <td className="p-4 font-medium">
                    <div>{payment.user?.name || 'Unknown User'}</div>
                    <div className="text-xs text-[var(--text-secondary)] font-normal">{payment.user?.email}</div>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {payment.trip?.eventTitle || 'Unknown Trip'}
                  </td>
                  <td className="p-4 font-semibold text-[var(--text-primary)]">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {payment.paymentMethod}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span>{payment.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-[var(--text-secondary)]">
                    {payment.transactionId || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManagement;
