import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageBanner from './components/PageBanner';
import api from '../utils/axiosConfig';

export default function Confirmation() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Lỗi tải đơn hàng:', err);
        setError('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <PageBanner page="Xác nhận đơn hàng" header="Đặt hàng thành công" />
        <div className="container text-center py-5">Đang tải thông tin đơn hàng...</div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <PageBanner page="Xác nhận đơn hàng" header="Đặt hàng thành công" />
        <div className="container text-center py-5 text-danger">
          {error || 'Không tìm thấy đơn hàng'}
        </div>
      </>
    );
  }

  // Tính tổng tiền
  const subtotal = order.totalAmount;
  const shippingFee = 0; // miễn phí vận chuyển
  const total = subtotal + shippingFee;

  return (
    <>
      <PageBanner page="Xác nhận đơn hàng" header="Đặt hàng thành công" />

      <section className="order_details section_gap">
        <div className="container">
          <h3 className="title_confirmation">
            Cảm ơn bạn. Đơn hàng #{order.id} của bạn đã được tiếp nhận.
          </h3>

          <div className="row order_d_inner">
            {/* Thông tin đơn hàng */}
            <div className="col-lg-4">
              <div className="details_item">
                <h4>Thông tin đơn hàng</h4>
                <ul className="list">
                  <li><span>Mã đơn</span> : {order.id}</li>
                  <li><span>Ngày đặt</span> : {new Date(order.orderDate).toLocaleDateString('vi-VN')}</li>
                  <li><span>Tổng tiền</span> : {order.totalAmount.toLocaleString('vi-VN')}đ</li>
                  <li><span>Thanh toán</span> : {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</li>
                </ul>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="col-lg-4">
              <div className="details_item">
                <h4>Địa chỉ giao hàng</h4>
                <ul className="list">
                  <li><span>Địa chỉ</span> : {order.shippingAddress}</li>
                  <li><span>Số điện thoại</span> : {order.phone}</li>
                  <li><span>Trạng thái</span> : {order.status === 'PENDING' ? 'Chờ xử lý' : order.status}</li>
                </ul>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="col-lg-4">
              <div className="details_item">
                <h4>Phương thức thanh toán</h4>
                <ul className="list">
                  <li><span>Phương thức</span> : {order.paymentMethod === 'COD' ? 'COD (Tiền mặt khi nhận hàng)' : 'Chuyển khoản ngân hàng'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="order_details_table">
            <h2>Chi tiết đơn hàng</h2>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems && order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>x{item.quantity}</td>
                      <td>{item.price.toLocaleString('vi-VN')}đ</td>
                      <td>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-right"><strong>Tạm tính</strong></td>
                    <td><strong>{subtotal.toLocaleString('vi-VN')}đ</strong></td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right"><strong>Phí vận chuyển</strong></td>
                    <td><strong>Miễn phí</strong></td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right"><strong>Tổng cộng</strong></td>
                    <td><strong>{total.toLocaleString('vi-VN')}đ</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}