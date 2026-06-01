import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PageBanner from './components/PageBanner';
import api from '../utils/axiosConfig';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Xóa lỗi khi người dùng sửa
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message;
      if (message && message.includes('username')) {
        setError('Tên đăng nhập đã tồn tại');
      } else if (message && message.includes('email')) {
        setError('Email đã được sử dụng');
      } else {
        setError('Đăng ký thất bại, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBanner page="Đăng ký tài khoản" header="Đăng ký tài khoản" />

      <section className="login_box_area section_gap">
        <div className="container">
          <div className="row">

            {/* BÊN TRÁI */}
            <div className="col-lg-6">
              <div className="login_box_img">
                <img className="img-fluid" src="assets/img/login.jpg" alt="" />
                <div className="hover">
                  <h4>Bạn đã có tài khoản?</h4>
                  <p>Nếu bạn đã có tài khoản, hãy đăng nhập để tiếp tục mua sắm.</p>
                  <button className="primary-btn" onClick={() => router.push('/login')}>
                    Đăng nhập ngay
                  </button>
                </div>
              </div>
            </div>

            {/* BÊN PHẢI - Form đăng ký */}
            <div className="col-lg-6">
              <div className="login_form_inner">
                <h3>Đăng ký tài khoản</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form className="row login_form" onSubmit={handleSubmit}>
                  <div className="col-md-12 form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Tên người dùng"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <div className="creat_account">
                      <input type="checkbox" id="terms" required />
                      <label htmlFor="terms">
                        Tôi đồng ý với điều khoản sử dụng
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <button type="submit" className="primary-btn" disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}