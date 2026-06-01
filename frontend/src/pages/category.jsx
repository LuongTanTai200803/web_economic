import React, { useState, useEffect } from 'react';
import PageBanner from './components/PageBanner';
import Related_product from './components/Related_product';
import api from '../utils/axiosConfig'; // đường dẫn tùy chỉnh

export default function Category() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Các state lọc
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  // Lấy danh sách sản phẩm theo bộ lọc
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sortBy,
        ...(selectedBrand && { brandId: selectedBrand }),
        ...(selectedColor && { colorId: selectedColor }),
        ...(searchKeyword && { keyword: searchKeyword })
      };
      const res = await api.get('/products', { params });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách thương hiệu và màu sắc cho bộ lọc
  const fetchFilters = async () => {
    try {
      const [brandRes, colorRes] = await Promise.all([
        api.get('/brands'),
        api.get('/colors')
      ]);
      setBrands(brandRes.data);
      setColors(colorRes.data);
    } catch (error) {
      console.error('Lỗi tải bộ lọc:', error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand, selectedColor, sortBy, searchKeyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // reset về trang đầu
    fetchProducts();
  };

  return (
    <>
      <PageBanner page="Danh mục sản phẩm" header="Trang cửa hàng" />
      <div className="container mt-5 pt-5">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-xl-3 col-lg-4 col-md-5">
            <div className="sidebar-categories">
              <div className="head">Danh mục sản phẩm</div>
              <ul className="main-categories">
                <li className="main-nav-list">
                  <a onClick={() => { setSelectedBrand(''); setSelectedColor(''); setPage(0); }} href="#">
                    Tất cả sản phẩm
                  </a>
                </li>
              </ul>
            </div>

            <div className="sidebar-filter mt-50">
              <div className="top-filter-head">Bộ lọc sản phẩm</div>
              
              <div className="common-filter">
                <div className="head">Thương hiệu</div>
                <form>
                  {brands.map(brand => (
                    <div key={brand.id}>
                      <label>
                        <input
                          type="radio"
                          name="brand"
                          value={brand.id}
                          checked={selectedBrand == brand.id}
                          onChange={() => { setSelectedBrand(brand.id); setPage(0); }}
                        /> {brand.name}
                      </label>
                    </div>
                  ))}
                </form>
              </div>

              <div className="common-filter mt-3">
                <div className="head">Màu sắc</div>
                <form>
                  {colors.map(color => (
                    <div key={color.id}>
                      <label>
                        <input
                          type="radio"
                          name="color"
                          value={color.id}
                          checked={selectedColor == color.id}
                          onChange={() => { setSelectedColor(color.id); setPage(0); }}
                        /> {color.name}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="col-xl-9 col-lg-8 col-md-7">
            <div className="filter-bar d-flex flex-wrap align-items-center">
              <div className="sorting">
                <select className="form-control" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
                  <option value="id">Mặc định</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
              <div className="sorting mr-auto">
                <form onSubmit={handleSearch} className="d-flex">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary ml-2">Tìm</button>
                </form>
              </div>
            </div>

            <section className="lattest-product-area pb-40 category-list">
              {loading ? (
                <div className="text-center">Đang tải...</div>
              ) : (
                <div className="row">
                  {products.map(product => (
                    <div className="col-lg-4 col-md-6" key={product.id}>
                      <div className="single-product">
                        <img className="img-fluid" src={product.imageUrl || 'assets/img/product/p1.jpg'} alt={product.name} />
                        <div className="product-details">
                          <h6>{product.name}</h6>
                          <div className="price">
                            <h6>{product.price.toLocaleString('vi-VN')}đ</h6>
                          </div>
                          <div className="prd-bottom">
                            <button className="social-info" onClick={() => window.location.href=`/product_detail?id=${product.id}`}>
                              <span className="lnr lnr-move"></span>
                              <p className="hover-text">Xem chi tiết</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <button disabled={page === 0} onClick={() => setPage(page-1)} className="btn btn-outline-secondary mr-2">Trước</button>
                  <span className="align-self-center">Trang {page+1} / {totalPages}</span>
                  <button disabled={page+1 >= totalPages} onClick={() => setPage(page+1)} className="btn btn-outline-secondary ml-2">Sau</button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      <Related_product />
    </>
  );
}