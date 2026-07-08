import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageBanner from './components/PageBanner';
import api from '../utils/axiosConfig';

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Thông tin thanh toán
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'COD'
  });

  // Lấy giỏ hàng khi component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        // Giả sử response có dạng { items: [...], totalAmount: ... }
        setCartItems(res.data.items || []);
        setTotalAmount(res.data.totalAmount || 0);
      } catch (err) {
        console.error('Lỗi tải giỏ hàng:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.phone || !formData.address) {
      alert('Vui lòng nhập số điện thoại và địa chỉ giao hàng');
      setSubmitting(false);
      return;
    }

    const payload = {
      shippingAddress: `${formData.address}, ${formData.city || ''}`,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod
    };

    try {
      const orderRes = await api.post('/orders', payload);
      const orderId = orderRes.data?.id;

      if (!orderId) {
        throw new Error('Không lấy được orderId từ response tạo đơn');
      }

      if (formData.paymentMethod === 'VNPAY') {
        const payRes = await api.post(`/payments/${orderId}/vnpay-url`);
        const paymentUrl =
          payRes.data?.paymentUrl ||
          payRes.data?.url ||
          payRes.data?.redirectUrl ||
          (typeof payRes.data === 'string' ? payRes.data : '');

        if (!paymentUrl) {
          throw new Error('Backend không trả về paymentUrl');
        }

        window.location.href = paymentUrl;
        return;
      }

      router.push(`/confirmation?orderId=${orderId}`);
    } catch (err) {
      console.error('Lỗi đặt hàng / tạo link thanh toán:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đặt hàng thất bại, vui lòng thử lại';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageBanner page="Thanh toán" header="Thanh toán" />
        <div className="container text-center py-5">Đang tải giỏ hàng...</div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <PageBanner page="Thanh toán" header="Thanh toán" />
        <div className="container text-center py-5">
          Giỏ hàng của bạn đang trống. <a href="/category">Tiếp tục mua sắm</a>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner page="Thanh toán" header="Thanh toán" />

      <section className="checkout_area section_gap">
        <div className="container">
          {/* Khách hàng quay lại - đơn giản hóa, chỉ chuyển hướng */}
          <div className="returning_customer">
            <div className="check_title">
              <h2>
                Khách hàng cũ? <a href="/login">Nhấn để đăng nhập</a>
              </h2>
            </div>
            <p>
              Nếu bạn đã đăng nhập, thông tin dưới đây sẽ được dùng để giao hàng.
            </p>
          </div>

          {/* Mã giảm giá - tạm thời bỏ qua */}
          <div className="cupon_area">
            <h2>Có mã giảm giá?</h2>
            <input type="text" placeholder="Nhập mã giảm giá" />
            <button className="tp_btn" onClick={() => alert('Chức năng chưa hỗ trợ')}>Áp dụng</button>
          </div>

          {/* Thanh toán */}
          <div className="billing_details">
            <div className="row">
              <div className="col-lg-8">
                <h3>Thông tin thanh toán</h3>
                <form className="row contact_form" onSubmit={handleSubmit}>
                  <div className="col-md-6 form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      placeholder="Họ và tên"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="Số điện thoại *"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Địa chỉ *"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      placeholder="Thành phố"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <textarea
                      className="form-control"
                      name="note"
                      placeholder="Ghi chú đơn hàng"
                      rows="3"
                      value={formData.note}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>

              {/* Đơn hàng */}
              <div className="col-lg-4">
                <div className="order_box">
                  <h2>Đơn hàng của bạn</h2>
                  <ul className="list">
                    <li>Sản phẩm <span>Tổng</span></li>
                    {cartItems.map(item => (
                      <li key={item.id}>
                        {item.productName} x {item.quantity}
                        <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="list list_2">
                    <li>Tạm tính <span>{totalAmount.toLocaleString('vi-VN')}đ</span></li>
                    <li>Phí ship <span>Miễn phí</span></li>
                    <li>Tổng cộng <span>{totalAmount.toLocaleString('vi-VN')}đ</span></li>
                  </ul>

                  <div className="payment_item">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      />
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  <div className="payment_item">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VNPAY"
                        checked={formData.paymentMethod === 'VNPAY'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'VNPAY' })}
                      />
                      Chuyển khoản ngân hàng
                    </label>
                  </div>

                  <div className="creat_account">
                    <input type="checkbox" id="agree" required />
                    <label htmlFor="agree">Tôi đồng ý với điều khoản</label>
                  </div>

                  <button
                    className="primary-btn"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Đang xử lý...' : 'Thanh toán ngay'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}