import React, { useState } from 'react';
import PageBanner from '../components/PageBanner'; // Tận dụng component có sẵn

export default function AdminProducts() {
  // 1. Dữ liệu mẫu ban đầu (Mock Data)
  const [products, setProducts] = useState([
    { id: 1, name: 'Giày Thể Thao Nam', price: 550000, category: 'Giày Dép', image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Áo Thun Cotton', price: 250000, category: 'Quần Áo', image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Balo Thời Trang', price: 400000, category: 'Phụ Kiện', image: 'https://via.placeholder.com/80' },
  ]);

  // 2. State quản lý Modal và Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '' });

  // 3. Các hàm xử lý (Handlers)
  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({ name: '', price: '', category: '', image: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', price: '', category: '', image: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      // Cập nhật sản phẩm (Edit)
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      // Thêm sản phẩm mới (Add)
      const newProduct = { 
        ...formData, 
        id: Date.now(), 
        price: Number(formData.price) || 0 
      };
      setProducts([...products, newProduct]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <PageBanner page="Sản Phẩm" header="Quản Lý Sản Phẩm" />

      <section className="admin_dashboard_area section_gap">
        <div className="container">
          
          {/* Header & Nút Thêm Mới */}
          <div className="row mb-4 align-items-center">
            <div className="col-md-6">
              <h3 style={{ color: '#222', fontWeight: '600', margin: 0 }}>Danh sách sản phẩm</h3>
            </div>
            <div className="col-md-6 text-right">
              <button 
                className="primary-btn" 
                style={{ border: 'none', cursor: 'pointer', padding: '0px 30px', lineHeight: '40px' }}
                onClick={() => handleOpenModal()}
              >
                + Thêm Sản Phẩm
              </button>
            </div>
          </div>

          {/* Bảng Danh Sách Sản Phẩm */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <table className="table table-striped align-middle">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th>ID</th>
                      <th>Hình ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Giá (VNĐ)</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td>#{product.id.toString().slice(-4)}</td>
                          <td>
                            <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          </td>
                          <td style={{ fontWeight: '500' }}>{product.name}</td>
                          <td>{product.category}</td>
                          <td>{Number(product.price).toLocaleString('vi-VN')} đ</td>
                          <td className="text-center">
                            <button 
                              className="btn btn-sm btn-outline-primary mr-2" 
                              onClick={() => handleOpenModal(product)}
                              style={{ marginRight: '8px' }}
                            >
                              <i className="lnr lnr-pencil"></i> Sửa
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleDelete(product.id)}
                            >
                              <i className="lnr lnr-trash"></i> Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">Chưa có sản phẩm nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Modal Thêm/Sửa Sản Phẩm (Inline Custom Modal) */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ margin: 0 }}>{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h4>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="form-group mb-3">
                <label>Tên sản phẩm</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group mb-3">
                <label>Giá (VNĐ)</label>
                <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group mb-3">
                <label>Danh mục</label>
                <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">-- Chọn danh mục --</option>
                  <option value="Giày Dép">Giày Dép</option>
                  <option value="Quần Áo">Quần Áo</option>
                  <option value="Phụ Kiện">Phụ Kiện</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label>Link Hình Ảnh (URL)</label>
                <input type="text" className="form-control" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." required />
              </div>
              
              <div className="text-right mt-4">
                <button type="button" className="btn btn-secondary mr-2" onClick={handleCloseModal} style={{ marginRight: '10px' }}>Hủy</button>
                <button type="submit" className="primary-btn" style={{ border: 'none', padding: '0px 20px', lineHeight: '38px' }}>
                  {editingId ? 'Cập nhật' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS cho Custom Modal và các chi tiết nhỏ */}
      <style jsx>{`
        .text-right { text-align: right; }
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
          max-width: 500px;
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