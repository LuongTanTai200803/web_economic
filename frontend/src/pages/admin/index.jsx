import React, { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import api from '../../utils/axiosConfig';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(prev => ({
          ...prev,
          totalOrders: res.data.totalOrders,
          revenue: res.data.totalRevenue,
          pendingOrders: res.data.pendingOrders
        }));
        // Lấy tổng số sản phẩm
        const productRes = await api.get('/products?size=1');
        setStats(prev => ({ ...prev, totalProducts: productRes.data.totalElements }));
      } catch (err) {
        console.error('Lỗi tải thống kê:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  return (
    <>
      <PageBanner page="Khu vực quản trị" header="Bảng điều khiển - Dashboard" />
      <section className="admin_dashboard_area section_gap">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 style={{ color: '#222', fontWeight: '600', marginBottom: '25px' }}>
                Thống kê hệ thống
              </h3>
            </div>
          </div>
          <div className="row">
            {/* Tổng sản phẩm */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="dashboard_card card_products">
                <div className="card_icon"><i className="lnr lnr-layers"></i></div>
                <div className="card_info">
                  <p className="card_title">Total Products</p>
                  <h3 className="card_value">{stats.totalProducts.toLocaleString('vi-VN')}</h3>
                </div>
              </div>
            </div>
            {/* Tổng đơn hàng */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="dashboard_card card_orders">
                <div className="card_icon"><i className="lnr lnr-cart"></i></div>
                <div className="card_info">
                  <p className="card_title">Total Orders</p>
                  <h3 className="card_value">{stats.totalOrders.toLocaleString('vi-VN')}</h3>
                </div>
              </div>
            </div>
            {/* Doanh thu */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="dashboard_card card_revenue">
                <div className="card_icon"><i className="lnr lnr-chart-bars"></i></div>
                <div className="card_info">
                  <p className="card_title">Revenue</p>
                  <h3 className="card_value">{stats.revenue.toLocaleString('vi-VN')}đ</h3>
                </div>
              </div>
            </div>
            {/* Đơn chờ xử lý */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="dashboard_card card_pending">
                <div className="card_icon"><i className="lnr lnr-sync"></i></div>
                <div className="card_info">
                  <p className="card_title">Pending Orders</p>
                  <h3 className="card_value">{stats.pendingOrders.toLocaleString('vi-VN')}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Nhúng trực tiếp để tạo kiểu dáng đồng bộ, bạn có thể chuyển phần này vào file CSS chung của Admin nếu muốn */}
      <style jsx>{`
        .dashboard_card {
          background: #fff;
          padding: 25px 20px;
          border-radius: 8px;
          box-shadow: 0px 10px 20px 0px rgba(153, 153, 153, 0.1);
          display: flex;
          align-items: center;
          border: 1px solid #eee;
          transition: all 0.3s ease;
        }
        .dashboard_card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 10px 25px 0px rgba(153, 153, 153, 0.2);
        }
        .card_icon {
          font-size: 35px;
          margin-right: 20px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        /* Màu sắc riêng cho từng loại Card dựa theo bộ nhận diện */
        .card_products .card_icon { background: #e3f2fd; color: #1e88e5; }
        .card_orders .card_icon { background: #e8f5e9; color: #43a047; }
        .card_revenue .card_icon { background: #f3e5f5; color: #8e24aa; }
        .card_pending .card_icon { background: #fffde7; color: #fbc02d; }

        .card_info {
          flex: 1;
        }
        .card_title {
          font-size: 13px;
          text-transform: uppercase;
          font-weight: 700;
          color: #777;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }
        .card_value {
          font-size: 24px;
          font-weight: 700;
          color: #222;
          margin-bottom: 3px;
        }
        .card_desc {
          font-size: 12px;
          color: #999;
          display: block;
        }
      `}</style>
    </>
  );
}