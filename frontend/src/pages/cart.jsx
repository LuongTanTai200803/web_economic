import React, { useState, useEffect } from 'react';
import PageBanner from './components/PageBanner';
import api from '../utils/axiosConfig';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Lấy giỏ hàng từ API
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      // Backend trả về { items: [...], totalAmount: ... }
      const items = res.data.items || [];
      setCartItems(items);
      setTotal(res.data.totalAmount || 0);
    } catch (err) {
      console.error('Lỗi tải giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Cập nhật số lượng sản phẩm trong giỏ
  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/items/${itemId}`, { quantity: newQty });
      fetchCart(); // Tải lại giỏ hàng sau khi cập nhật
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err);
    }
  };

  // Xóa sản phẩm khỏi giỏ
  const removeItem = async (itemId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ?')) return;
    try {
      await api.delete(`/cart/items/${itemId}`);
      fetchCart(); // Tải lại giỏ hàng sau khi xóa
    } catch (err) {
      console.error('Lỗi xóa sản phẩm:', err);
    }
  };

  if (loading) {
    return (
      <>
        <PageBanner page="Giỏ hàng" header="Giỏ hàng của bạn" />
        <div className="container text-center py-5">Đang tải giỏ hàng...</div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <PageBanner page="Giỏ hàng" header="Giỏ hàng của bạn" />
        <div className="container text-center py-5">
          Giỏ hàng trống. <a href="/category">Tiếp tục mua sắm</a>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner page="Giỏ hàng" header="Giỏ hàng của bạn" />
      <section className="cart_area">
        <div className="container">
          <div className="cart_inner">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="media">
                          <div className="d-flex">
                            {/* Nếu backend trả về productImage thì dùng, không thì ảnh mặc định */}
                            <img
                              src={item.productImage || '/assets/img/product/default.jpg'}
                              alt={item.productName}
                              width="80"
                            />
                          </div>
                          <div className="media-body">
                            <p>{item.productName}</p>
                          </div>
                        </div>
                      </td>
                      <td><h5>{item.price.toLocaleString('vi-VN')}đ</h5></td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                          className="input-text qty"
                          min="1"
                        />
                      </td>
                      <td><h5>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</h5></td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-right"><h5>Tạm tính</h5></td>
                    <td><h5>{total.toLocaleString('vi-VN')}đ</h5></td>
                    <td></td>
                  </tr>
                  <tr className="out_button_area">
                    <td colSpan="4" className="text-right">
                      <a className="primary-btn" href="/checkout">Thanh toán</a>
                    </td>
                    <td></td>
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