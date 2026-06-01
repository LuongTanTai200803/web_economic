import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import PageBanner from './components/PageBanner';
import Related_product from './components/Related_product';
import api from '../utils/axiosConfig';

// Import carousel (giống file gốc)
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;          // Lấy id sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // description, specs, review

  // Carousel options cho ảnh sản phẩm
  const carouselOptions = {
    items: 1,
    autoplay: false,
    loop: true,
    nav: true,
    dots: true,
  };

  // Lấy chi tiết sản phẩm từ API
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setError('');
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async () => {
    // Kiểm tra đăng nhập: nếu chưa có token thì chuyển đến login
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      router.push('/login');
      return;
    }
    try {
      await api.post('/cart/items', {
        productId: product.id,
        quantity: quantity
      });
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err) {
      console.error('Lỗi thêm vào giỏ:', err);
      alert('Thêm vào giỏ thất bại, vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <>
        <PageBanner page="Chi tiết sản phẩm" header="Chi tiết sản phẩm" />
        <div className="container text-center py-5">Đang tải thông tin sản phẩm...</div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageBanner page="Chi tiết sản phẩm" header="Chi tiết sản phẩm" />
        <div className="container text-center py-5 text-danger">{error || 'Không tìm thấy sản phẩm'}</div>
      </>
    );
  }

  return (
    <>
      <PageBanner page="Chi tiết sản phẩm" header="Chi tiết sản phẩm" />

      {/* ================= SINGLE PRODUCT ================= */}
      <div className="product_image_area">
        <div className="container">
          <div className="row s_product_inner">
            {/* Ảnh sản phẩm (có thể dùng carousel nếu có nhiều ảnh) */}
            <div className="col-lg-6">
              {product.imageUrl ? (
                <OwlCarousel className="s_Product_carousel" {...carouselOptions}>
                  <div className="single-prd-item">
                    <img className="img-fluid" src={product.imageUrl} alt={product.name} />
                  </div>
                  {/* Nếu có thêm ảnh phụ, có thể thêm slide ở đây */}
                </OwlCarousel>
              ) : (
                <img className="img-fluid" src="/assets/img/product/default.jpg" alt={product.name} />
              )}
            </div>

            {/* Thông tin sản phẩm */}
            <div className="col-lg-5 offset-lg-1">
              <div className="s_product_text">
                <h3>{product.name}</h3>
                <h2>{product.price.toLocaleString('vi-VN')}đ</h2>
                <ul className="list">
                  <li>
                    <span>Thương hiệu:</span> {product.brand?.name || 'Không có'}
                  </li>
                  <li>
                    <span>Màu sắc:</span> {product.color?.name || 'Không có'}
                  </li>
                  <li>
                    <span>Tình trạng:</span> {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </li>
                  <li>
                    <span>Mã sản phẩm:</span> #{product.id}
                  </li>
                </ul>
                <p>{product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>

                {/* Số lượng */}
                <div className="product_count">
                  <label>Số lượng:</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val) || val < 1) val = 1;
                      if (product.stock && val > product.stock) val = product.stock;
                      setQuantity(val);
                    }}
                    className="input-text qty"
                    min="1"
                    max={product.stock || 999}
                  />
                </div>

                {/* Nút thêm giỏ hàng */}
                <div className="card_area d-flex align-items-center">
                  <button className="primary-btn" onClick={addToCart}>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTION / SPECS / REVIEW ================= */}
      <section className="product_description_area">
        <div className="container">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Thông số
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'review' ? 'active' : ''}`}
                onClick={() => setActiveTab('review')}
              >
                Đánh giá
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* Mô tả */}
            {activeTab === 'description' && (
              <div className="tab-pane fade show active">
                <p>{product.description || 'Chưa có mô tả chi tiết.'}</p>
              </div>
            )}

            {/* Thông số kỹ thuật (có thể lấy từ product.specs nếu có, tạm thời hiển thị mẫu) */}
            {activeTab === 'specs' && (
              <div className="tab-pane fade show active">
                <table className="table">
                  <tbody>
                    <tr><td>Chất liệu</td><td>Da tổng hợp, vải lưới</td></tr>
                    <tr><td>Đế giày</td><td>Đế cao su chống trơn</td></tr>
                    <tr><td>Xuất xứ</td><td>Việt Nam</td></tr>
                    <tr><td>Bảo hành</td><td>12 tháng</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Đánh giá - đơn giản, có thể mở rộng sau */}
            {activeTab === 'review' && (
              <div className="tab-pane fade show active">
                <p>Chức năng đánh giá đang được phát triển. Vui lòng quay lại sau.</p>
                {/* Có thể thêm form đánh giá nếu cần */}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sản phẩm liên quan (có thể dùng API /products?related=true hoặc lấy sản phẩm cùng danh mục) */}
      <Related_product />
    </>
  );
}