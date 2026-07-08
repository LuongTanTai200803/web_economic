import React, { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import api from '../../utils/axiosConfig';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy danh sách đơn hàng từ API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/admin/all');
      // Chuyển đổi dữ liệu API sang format giống mock cũ để giữ nguyên giao diện
      const formattedOrders = res.data.map(order => ({
        id: order.id,
        customerName: order.user?.username || 'Khách',
        createdAt: new Date(order.orderDate).toLocaleDateString('vi-VN'),
        totalPrice: order.totalAmount,
        status: order.status,
        items: order.orderItems.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      }));
      setOrders(formattedOrders);
    } catch (err) {
      console.error('Lỗi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status?status=${newStatus}`);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Cập nhật trạng thái thất bại:', err);
      alert('Cập nhật thất bại, vui lòng thử lại');
    }
  };

  // Xóa đơn hàng
  const handleDeleteOrder = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${id}?`)) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      console.error('Xóa đơn hàng thất bại:', err);
      alert('Xóa thất bại');
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'PENDING': return { background: '#fff3cd', color: '#856404' };
      case 'PROCESSING': return { background: '#cce5ff', color: '#004085' };
      case 'SHIPPING': return { background: '#e2e3e5', color: '#383d41' };
      case 'COMPLETED': return { background: '#d4edda', color: '#155724' };
      case 'CANCELLED': return { background: '#f8d7da', color: '#721c24' };
      default: return { background: '#eee', color: '#333' };
    }
  };

  if (loading) {
    return (
      <>
        <PageBanner page="Đơn Hàng" header="Quản Lý Đơn Hàng" />
        <div className="container text-center py-5">Đang tải đơn hàng...</div>
      </>
    );
  }

  return (
    <>
      <PageBanner page="Đơn Hàng" header="Quản Lý Đơn Hàng" />
      <section className="admin_dashboard_area section_gap">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h3 style={{ color: '#222', fontWeight: '600', margin: 0 }}>Danh sách đơn đặt hàng</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <table className="table table-hover align-middle">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th>Mã Đơn</th>
                      <th>Khách hàng</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền (VNĐ)</th>
                      <th>Trạng thái</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: '600', color: '#ffa500' }}>#{order.id}</td>
                          <td style={{ fontWeight: '500' }}>{order.customerName}</td>
                          <td>{order.createdAt}</td>
                          <td>{order.totalPrice.toLocaleString('vi-VN')} đ</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              style={{
                                ...getStatusBadgeStyle(order.status),
                                border: '1px solid #ccc',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              <option value="PENDING">⚠️ Chờ xử lý (Pending)</option>
                              <option value="PROCESSING">⚙️ Đang xử lý (Processing)</option>
                              <option value="SHIPPING">🚚 Đang giao (Shipping)</option>
                              <option value="COMPLETED">✅ Hoàn thành (Completed)</option>
                              <option value="CANCELLED">❌ Đã hủy (Cancelled)</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-info mr-2"
                              onClick={() => handleOpenDetails(order)}
                              style={{ marginRight: '8px' }}
                            >
                              <i className="lnr lnr-eye"></i> Xem Chi Tiết
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <i className="lnr lnr-trash"></i> Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy đơn hàng nào trong danh sách.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && selectedOrder && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ margin: 0 }}>Chi tiết đơn hàng #{selectedOrder.id}</h4>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="customer_meta mb-4 p-3" style={{ background: '#f8f9fa', borderRadius: '6px' }}>
                <p className="mb-1"><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                <p className="mb-1"><strong>Ngày tạo đơn:</strong> {selectedOrder.createdAt}</p>
                <p className="mb-0">
                  <strong>Trạng thái hiện tại: </strong>
                  <span className="badge p-2" style={{ ...getStatusBadgeStyle(selectedOrder.status), borderRadius: '12px' }}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
              <h5 className="mb-2" style={{ fontWeight: '600' }}>Danh sách vật phẩm</h5>
              <div className="table-responsive mb-3">
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-right">Đơn giá</th>
                      <th className="text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td className="text-center">x{item.quantity}</td>
                        <td className="text-right">{item.price.toLocaleString('vi-VN')} đ</td>
                        <td className="text-right" style={{ fontWeight: '500' }}>
                          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right p-2 mb-3" style={{ fontSize: '18px', borderTop: '2px solid #ddd' }}>
                <strong>Tổng cộng thanh toán: </strong>
                <span style={{ color: '#ff2f2f', fontWeight: '700', marginLeft: '10px' }}>
                  {selectedOrder.totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
            <div className="text-right mt-4">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .custom-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .custom-modal-content {
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .close-btn {
          background: transparent;
          border: none;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          color: #999;
        }
        .close-btn:hover {
          color: #333;
        }
      `}</style>
    </>
  );
}