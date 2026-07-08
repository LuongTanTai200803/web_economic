import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageBanner from './components/PageBanner';
import api from '../utils/axiosConfig';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const normalizeOrders = (data) => {
    if (Array.isArray(data)) return { list: data, totalPages: 1 };
    if (Array.isArray(data?.content)) {
      return { list: data.content, totalPages: data.totalPages || 1 };
    }
    if (Array.isArray(data?.orders)) {
      return { list: data.orders, totalPages: data.totalPages || 1 };
    }
    if (Array.isArray(data?.data)) {
      return { list: data.data, totalPages: data.totalPages || 1 };
    }
    return { list: [], totalPages: 1 };
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/orders', {
        params: { page: page, size: 10 }
      });
      const normalized = normalizeOrders(res.data);
      setOrders(normalized.list);
      setTotalPages(normalized.totalPages);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Bạn cần đăng nhập để xem lịch sử đơn hàng');
      } else {
        setError(err.response?.data?.message || 'Không tải được lịch sử đơn hàng');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const statusLabel = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'PENDING') return 'Chờ xử lý';
    if (s === 'CONFIRMED') return 'Đã xác nhận';
    if (s === 'SHIPPING') return 'Đang giao';
    if (s === 'COMPLETED') return 'Hoàn tất';
    if (s === 'CANCELLED') return 'Đã hủy';
    if (s === 'PAID') return 'Đã thanh toán';
    return status || 'Không rõ';
  };

  const paymentLabel = (paymentMethod) => {
    const p = String(paymentMethod || '').toUpperCase();
    if (p === 'COD') return 'COD';
    if (p === 'VNPAY') return 'VNPay';
    return paymentMethod || 'Không rõ';
  };

  return (
    <>
      <PageBanner page="Lịch sử đơn hàng" header="Đơn hàng của tôi" />

      <section className="cart_area section_gap">
        <div className="container">
          {loading && <div className="text-center py-4">Đang tải đơn hàng...</div>}

          {!loading && error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-4">
              Bạn chưa có đơn hàng nào. <Link href="/category">Mua sắm ngay</Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Thanh toán</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleString('vi-VN')
                          : '-'}
                      </td>
                      <td>{paymentLabel(order.paymentMethod)}</td>
                      <td>
                        {Number(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                      </td>
                      <td>{statusLabel(order.status)}</td>
                      <td>
                        <Link
                          className="primary-btn"
                          href={'/confirmation?orderId=' + order.id}
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-outline-secondary mr-2"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    Trước
                  </button>
                  <span className="align-self-center">
                    Trang {page + 1} / {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary ml-2"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}