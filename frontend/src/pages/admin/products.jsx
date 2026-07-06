import React, { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import api from '../../utils/axiosConfig';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', brandId: '', colorId: '', imageUrl: ''
  });

  // Load dữ liệu
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?size=100'); // lấy nhiều
      setProducts(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandsColors = async () => {
    const [brandRes, colorRes] = await Promise.all([
      api.get('/brands'),
      api.get('/colors')
    ]);
    setBrands(brandRes.data);
    setColors(colorRes.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchBrandsColors();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        brandId: product.brand?.id || '',
        colorId: product.color?.id || '',
        imageUrl: product.imageUrl || ''
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: '', description: '', price: '', stock: '', brandId: '', colorId: '', imageUrl: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error('Lưu sản phẩm thất bại:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Xóa thất bại:', err);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <>
      <PageBanner page="Sản Phẩm" header="Quản Lý Sản Phẩm" />
      <div className="container mt-4">
        <button className="btn btn-primary mb-3" onClick={() => handleOpenModal()}>
          + Thêm sản phẩm
        </button>
        <table className="table table-bordered">
          <thead>
            <tr><th>ID</th><th>Tên</th><th>Giá</th><th>Tồn kho</th><th>Thương hiệu</th><th>Màu</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.name}</td><td>{p.price.toLocaleString('vi-VN')}đ</td>
                <td>{p.stock}</td><td>{p.brand?.name}</td><td>{p.color?.name}</td>
                <td>
                  <button className="btn btn-sm btn-warning" onClick={() => handleOpenModal(p)}>Sửa</button>
                  <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(p.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa (giữ nguyên style từ file gốc) */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editingId ? 'Cập nhật' : 'Thêm mới'} sản phẩm</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <input className="form-control mb-2" name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} required />
                  <textarea className="form-control mb-2" name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
                  <input className="form-control mb-2" type="number" name="price" placeholder="Giá" value={formData.price} onChange={handleChange} required />
                  <input className="form-control mb-2" type="number" name="stock" placeholder="Tồn kho" value={formData.stock} onChange={handleChange} required />
                  <select className="form-control mb-2" name="brandId" value={formData.brandId} onChange={handleChange} required>
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <select className="form-control mb-2" name="colorId" value={formData.colorId} onChange={handleChange} required>
                    <option value="">Chọn màu sắc</option>
                    {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input className="form-control mb-2" name="imageUrl" placeholder="URL ảnh" value={formData.imageUrl} onChange={handleChange} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}