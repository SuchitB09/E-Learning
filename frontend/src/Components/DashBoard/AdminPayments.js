import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import Navbar from './Navbar';

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/payments')
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error('Error fetching payments:', err));
  }, []);

  // Normalize date to 'YYYY-MM-DD'
  const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

  // Filter payments by selected date
  const filteredPayments = selectedDate
    ? payments.filter((payment) => formatDate(payment.paymentDate) === selectedDate)
    : payments;

  // Group payments by normalized date
  const paymentsByDate = filteredPayments.reduce((acc, payment) => {
    const date = formatDate(payment.paymentDate); // e.g., "2025-06-13"
    if (!acc[date]) acc[date] = [];
    acc[date].push(payment);
    return acc;
  }, {});

  // Sort date groups in descending order
  const sortedDateGroups = Object.entries(paymentsByDate).sort(
    ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
  );

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <SideBar current={"admin-payments"} />
      <section id="content">
        <Navbar />
        <main style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
            Payment Details {selectedDate && `(Filtered by ${selectedDate})`}
          </h2>

          {/* Date Filter */}
          <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label htmlFor="filter-date" style={{ fontWeight: 'bold' }}>Filter by Date:</label>
            <input
              type="date"
              id="filter-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear Filter
              </button>
            )}
          </div>

          {sortedDateGroups.length === 0 ? (
            <p style={{ color: '#888', fontSize: '18px' }}>No payments found for the selected date.</p>
          ) : (
            sortedDateGroups.map(([date, payments], groupIndex) => {
              const dayTotal = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
              return (
                <div key={groupIndex} style={{ marginBottom: '40px' }}>
                  <h3 style={{ color: '#007bff', marginBottom: '10px' }}>
                    {new Date(date).toLocaleDateString()} ({payments.length} payments)
                  </h3>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                      <tr>
                        <th style={{ padding: '12px' }}>#</th>
                        <th style={{ padding: '12px' }}>Amount (₹)</th>
                        <th style={{ padding: '12px' }}>Payment ID</th>
                        <th style={{ padding: '12px' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => (
                        <tr key={payment.id || index} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                          <td style={{ padding: '10px' }}>₹{payment.amount.toFixed(2)}</td>
                          <td style={{ padding: '10px' }}>{payment.paymentIntentId}</td>
                          <td style={{ padding: '10px' }}>
                            {new Date(payment.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#f0f8ff', fontWeight: 'bold' }}>
                        <td colSpan="2" style={{ padding: '12px', textAlign: 'right' }}>Daily Total:</td>
                        <td colSpan="2" style={{ padding: '12px', color: 'green', fontSize: '16px' }}>
                          ₹{dayTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
          )}
        </main>
      </section>
    </div>
  );
}

export default AdminPayments;
