import React, { useState } from 'react';
const Payment = () => {
  const [order, setOrder] = useState(null);
  const createOrder = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 50000, // Amount in the smallest currency unit
          currency: "INR",
          receipt: "order_rcptid_11"
        })
      });
      const orderData = await response.json();
      setOrder(orderData);
      return orderData;
    } catch (error) {
      console.error('Failed to create order', error);
    }
  };
  const handlePayment = async () => {
    const orderData = await createOrder();
    if (!orderData) return;
    const options = {
      key: 'rzp_test_MaurPHCbjsztr8', // Enter the Key ID generated from the Dashboard
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Merchant Name',
      description: 'Test Transaction',
      order_id: orderData.id,
      handler: async (response) => {
        try {
          const paymentData = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature
          };
          const verifyResponse = await fetch('http://localhost:4000/api/process-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
          });
          const verifyResult = await verifyResponse.text();
          alert(verifyResult);
        } catch (error) {
          console.error('Failed to process payment', error);
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399CC'
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
';kk'
  return (
    <div>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};
export default Payment;







