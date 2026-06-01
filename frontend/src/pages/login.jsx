import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PageBanner from './components/PageBanner';
import api from '../utils/axiosConfig'; // đã tạo ở bước trước

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, userId, role } = response.data;

      // Lưu token và thông tin user
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      if (remember) {
        localStorage.setItem('rememberUsername', username);
      } else {
        localStorage.removeItem('rememberUsername');
      }

      // Chuyển hướng dựa trên role
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  // Lấy username đã lưu nếu có
  React.useEffect(() => {
    const savedUsername = localStorage.getItem('rememberUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRemember(true);
    }
  }, []);

  return (
    <>
      <PageBanner page="Đăng nhập / Đăng ký" header="Đăng nhập / Đăng ký" />

      <section className="login_box_area section_gap">
        <div className="container">
          <div className="row">

            {/* BÊN TRÁI - Hình ảnh giới thiệu */}
            <div className="col-lg-6">
              <div className="login_box_img">
                <img className="img-fluid" src="assets/img/login.jpg" alt="" />
                <div className="hover">
                  <h4>Bạn mới với website?</h4>
                  <p>Chào mừng bạn đến với cửa hàng giày của chúng tôi. Hãy tạo tài khoản để mua sắm dễ dàng hơn.</p>
                  <button className="primary-btn" onClick={() => router.push('/register')}>
                    Tạo tài khoản
                  </button>
                </div>
              </div>
            </div>

            {/* BÊN PHẢI - Form đăng nhập */}
            <div className="col-lg-6">
              <div className="login_form_inner">
                <h3>Đăng nhập hệ thống</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form className="row login_form" onSubmit={handleSubmit}>
                  <div className="col-md-12 form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <div className="creat_account">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <button type="submit" className="primary-btn" disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                    <a href="#">Quên mật khẩu?</a>
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