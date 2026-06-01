import React, { useState, useEffect } from 'react';

export default function Category() {
  // 1. Khai báo các State để quản lý dữ liệu và bộ lọc
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(''); // Thêm giá trị mặc định nếu có
  const [selectedColor, setSelectedColor] = useState(''); // Thêm giá trị mặc định nếu có
  const [sortBy, setSortBy] = useState('id');             // Thêm giá trị mặc định nếu có

  // 2. useEffect gọi API mỗi khi các bộ lọc thay đổi
  useEffect(() => {
    fetch(`/api/products?brandId=${selectedBrand}&colorId=${selectedColor}&sortBy=${sortBy}&page=0&size=12`)
      .then(res => res.json())
      .then(data => {
        // Kiểm tra cấu trúc API trả về (thường Spring Boot trả về data.content)
        if (data && data.content) {
          setProducts(data.content);
        } else if (Array.isArray(data)) {
          setProducts(data); // Trường hợp API trả trực tiếp mảng
        }
      })
      .catch(err => console.error("Lỗi khi fetch sản phẩm: ", err));
  }, [selectedBrand, selectedColor, sortBy]);

  return (
    <>
      {/* Start category Area */}
      <section className="category-area">
        <div className="container">
          <div className="row justify-content-center">
            
            <div className="col-lg-8 col-md-12">
              <div className="row">
                
                {/* 3. Render động danh sách sản phẩm bằng .map() */}
                {products.length > 0 ? (
                  products.map((product, index) => {
                    // Logic tính class Bootstrap (col-8 hoặc col-4) xen kẽ giống như giao diện gốc của bạn
                    const colClass = (index === 0 || index === 3) ? "col-lg-8 col-md-8" : "col-lg-4 col-md-4";

                    return (
                      <div className={colClass} key={product.id || index}>
                        <div className="single-deal">
                          <div className="overlay" />
                          <img
                            className="img-fluid w-100"
                            src={product.imageUrl || "assets/img/category/c1.jpg"} // Thay bằng field ảnh từ API của bạn
                            alt={product.name}
                          />
                          <a href={product.imageUrl || "assets/img/category/c1.jpg"} className="img-pop-up" target="_blank" rel="noreferrer">
                            <div className="deal-details">
                              <h6 className="deal-title">{product.name || "Tên sản phẩm"}</h6> {/* Thay bằng field tên từ API */}
                            </div>
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center">
                    <p>Không có sản phẩm nào được tìm thấy hoặc đang tải...</p>
                  </div>
                )}

              </div>
            </div>

            {/* Phần này ở code gốc của bạn nằm ngoài hàng col-lg-8, 
                nếu muốn hiển thị cố định hoặc xử lý riêng thì để đây */}
            <div className="col-lg-4 col-md-6">
              <div className="single-deal">
                <div className="overlay" />
                <img
                  className="img-fluid w-100"
                  src="assets/img/category/c5.jpg"
                  alt=""
                />
                <a href="assets/img/category/c5.jpg" className="img-pop-up" target="_blank" rel="noreferrer">
                  <div className="deal-details">
                    <h6 className="deal-title">Sản phẩm nổi bật khác</h6>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* End category Area */}
    </>
  );
}