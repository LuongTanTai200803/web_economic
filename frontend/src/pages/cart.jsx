import React, { useState, useEffect } from 'react';
import PageBanner from './components/PageBanner';
import api from '../utils/axiosConfig';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data);
      const sum = res.data.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
      setTotal(sum);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    await api.put(`/cart/items/${itemId}`, { quantity: newQty });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
    fetchCart();
  };

  if (cartItems.length === 0) return <div>Giỏ hàng trống</div>;

  return (
    <>
      <PageBanner page="Giỏ hàng" header="Giỏ hàng của bạn" />
      <section className="cart_area">
        <div className="container">
          <div className="cart_inner">
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Tổng</th></tr></thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td><div className="media"><div className="d-flex"><img src={item.product.imageUrl} alt="" width="80"/></div><div className="media-body"><p>{item.product.name}</p></div></div></td>
                      <td><h5>{item.product.price.toLocaleString('vi-VN')}đ</h5></td>
                      <td><input type="number" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))} className="input-text qty" /></td>
                      <td><h5>{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</h5></td>
                      <td><button onClick={() => removeItem(item.id)}>Xóa</button></td>
                    </tr>
                  ))}
                  <tr><td></td><td></td><td><h5>Tạm tính</h5></td><td><h5>{total.toLocaleString('vi-VN')}đ</h5></td></tr>
                  <tr className="out_button_area"><td></td><td></td><td></td><td><a className="primary-btn" href="/checkout">Thanh toán</a></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}