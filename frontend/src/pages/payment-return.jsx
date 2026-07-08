import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import PageBanner from './components/PageBanner';

export default function PaymentReturnPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PENDING');
  const [message, setMessage] = useState('Đang kiểm tra trạng thái thanh toán...');
  const [order, setOrder] = useState(null);

  const checkStatus = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const [payRes, orderRes] = await Promise.all([
        api.get(`/payments/${orderId}/status`),
        api.get(`/orders/${orderId}`)
      ]);

      const pay = payRes.data || {};
      const orderData = orderRes.data || {};
      setOrder(orderData);

      const raw = String(
        pay.status || pay.paymentStatus || pay.result || ''
      ).toUpperCase();

      const paid = raw === 'SUCCESS' || raw === 'PAID' || pay.responseCode === '00';

      if (paid) {
        setStatus('SUCCESS');
        setMessage('Thanh toán VNPay thành công.');
      } else if (raw === 'FAILED' || raw === 'ERROR') {
        setStatus('FAILED');
        setMessage('Thanh toán thất bại hoặc bị hủy.');
      } else {
        setStatus('PENDING');
        setMessage('Đơn hàng đang chờ xác nhận thanh toán.');
      }
    } catch (err) {
      setStatus('FAILED');
      setMessage(err.response?.data?.message || 'Không kiểm tra được trạng thái thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const repay = async () => {
    try {
      const res = await api.post(`/payments/${orderId}/vnpay-url`);
      const url =
        res.data?.paymentUrl ||
        res.data?.url ||
        res.data?.redirectUrl ||
        (typeof res.data === 'string' ? res.data : '');
      if (!url) throw new Error('Không có URL thanh toán');
      window.location.href = url;
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Không tạo lại được link thanh toán');
    }
  };

  useEffect(() => {
    if (!router.isReady || !orderId) return;
    checkStatus();
  }, [router.isReady, orderId]);

  return (
    <>
      <PageBanner page="Kết quả thanh toán" header="Kết quả thanh toán VNPay" />
      <div className="container py-5 text-center">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <>
            <h3>{message}</h3>
            {order?.id && <p>Mã đơn: #{order.id}</p>}

            <div className="mt-4">
              <button className="primary-btn mr-2" onClick={checkStatus}>
                Kiểm tra lại
              </button>

              {status === 'SUCCESS' && (
                <button
                  className="primary-btn ml-2"
                  onClick={() => router.push(`/confirmation?orderId=${orderId}`)}
                >
                  Xem xác nhận đơn
                </button>
              )}

              {status !== 'SUCCESS' && (
                <button className="primary-btn ml-2" onClick={repay}>
                  Thanh toán lại VNPay
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}