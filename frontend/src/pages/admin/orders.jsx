import React, { useState } from 'react';
import PageBanner from '../components/PageBanner'; // Tận dụng component Banner có sẵn

export default function AdminOrders() {
  // 1. Dữ liệu mẫu đơn hàng khởi tạo (Mock Data)
  const [orders, setOrders] = useState([
    {
      id: 'ORD-5402',
      customerName: 'Nguyễn Văn An',
      createdAt: '20/05/2026',
      totalPrice: 1350000,
      status: 'Pending',
      items: [
        { name: 'Giày Thể Thao Nam Premium', quantity: 2, price: 550000 },
        { name: 'Áo Thun Cotton', quantity: 1, price: 250000 }
      ]
    },
    {
      id: 'ORD-8821',
      customerName: 'Trần Thị Bích',
      createdAt: '19/05/2026',
      totalPrice: 400000,
      status: 'Processing',
      items: [
        { name: 'Balo Thời Trang Hàn Quốc', quantity: 1, price: 400000 }
      ]
    },
    {
      id: 'ORD-1104',
      customerName: 'Phạm Minh Hoàng',
      createdAt: '18/05/2026',
      totalPrice: 1050000,
      status: 'Completed',
      items: [
        { name: 'Giày Thể Thao Nam Premium', quantity: 1, price: 550000 },
        { name: 'Balo Thời Trang Hàn Quốc', quantity: 1, price: 400000 },
        { name: 'Áo Thun Cotton', quantity: 0, price: 250000 } // Fix demo sản phẩm tặng kèm hoặc số lượng khác
      ]
    }
  ]);

  // 2. Các State quản lý Modal xem chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Hàm cập nhật trạng thái đơn hàng (Dropdown Change)
  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  // 4. Hàm xóa đơn hàng
  const handleDeleteOrder = (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${id}?`)) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  // 5. Hàm điều khiển Modal chi tiết
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Helper hàm xác định màu sắc hiển thị cho các Trạng thái (Badge style)
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending': return { background: '#fff3cd', color: '#856404' };      // Vàng nhạt
      case 'Processing': return { background: '#cce5ff', color: '#004085' };   // Xanh dương nhạt
      case 'Shipping': return { background: '#e2e3e5', color: '#383d41' };     // Xám nhạt
      case 'Completed': return { background: '#d4edda', color: '#155724' };    // Xanh lá nhạt
      case 'Cancelled': return { background: '#f8d7da', color: '#721c24' };    // Đỏ nhạt
      default: return { background: '#eee', color: '#333' };
    }
  };

  return (
    <>
      <PageBanner page="Đơn Hàng" header="Quản Lý Đơn Hàng" />

      <section className="admin_dashboard_area section_gap">
        <div className="container">
          
          {/* Header Tiêu đề cấu trúc giống với trang sản phẩm */}
          <div className="row mb-4">
            <div className="col-12">
              <h3 style={{ color: '#222', fontWeight: '600', margin: 0 }}>Danh sách đơn đặt hàng</h3>
            </div>
          </div>

          {/* Bảng Hiển Thị Đơn Hàng */}
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
                            {/* Dropdown chỉnh nhanh trạng thái ngay tại dòng dữ liệu */}
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
                              <option value="Pending">⚠️ Chờ xử lý (Pending)</option>
                              <option value="Processing">⚙️ Đang xử lý (Processing)</option>
                              <option value="Shipping">🚚 Đang giao (Shipping)</option>
                              <option value="Completed">✅ Hoàn thành (Completed)</option>
                              <option value="Cancelled">❌ Đã hủy (Cancelled)</option>
                            </select>
                          </td>
                          <td className="text-center">
                            {/* Nút Xem chi tiết đơn hàng */}
                            <button 
                              className="btn btn-sm btn-outline-info mr-2" 
                              onClick={() => handleOpenDetails(order)}
                              style={{ marginRight: '8px' }}
                            >
                              <i className="lnr lnr-eye"></i> Xem Chi Tiết
                            </button>
                            {/* Nút Xóa Đơn Hàng */}
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

      {/* Modal Xem Chi Tiết Đơn Hàng (Tái sử dụng cấu trúc UI của dự án) */}
      {isModalOpen && selectedOrder && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ margin: 0 }}>Chi tiết đơn hàng #{selectedOrder.id}</h4>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              {/* Thông tin chung khách hàng */}
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

              {/* Danh sách các sản phẩm có trong đơn hàng */}
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

              {/* Tổng thanh toán */}
              <div className="text-right p-2 mb-3" style={{ fontSize: '18px', borderTop: '2px solid #ddd' }}>
                <strong>Tổng cộng thanh toán: </strong>
                <span style={{ color: '#ff2f2f', fontWeight: '700', marginLeft: '10px' }}>
                  {selectedOrder.totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Footer Modal đóng nhanh */}
            <div className="text-right mt-4">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kế thừa và đồng bộ các Class CSS bổ trợ giống trang quản lý trước */}
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