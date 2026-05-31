import React from 'react'
import PageBanner from './components/PageBanner'

export default function checkout() {
  return (
    <>
      <PageBanner page="Thanh toán" header="Thanh toán" />

      <section className="checkout_area section_gap">
        <div className="container">

          {/* Khách hàng quay lại */}
          <div className="returning_customer">
            <div className="check_title">
              <h2>
                Khách hàng cũ? <a href="#">Nhấn để đăng nhập</a>
              </h2>
            </div>
            <p>
              Nếu bạn đã từng mua hàng, hãy đăng nhập. Nếu là khách mới, hãy điền thông tin thanh toán bên dưới.
            </p>

            <form className="row contact_form">
              <div className="col-md-6 form-group">
                <input type="text" className="form-control" placeholder="Email hoặc tên đăng nhập" />
              </div>
              <div className="col-md-6 form-group">
                <input type="password" className="form-control" placeholder="Mật khẩu" />
              </div>

              <div className="col-md-12 form-group">
                <button type="submit" className="primary-btn">
                  Đăng nhập
                </button>

                <div className="creat_account">
                  <input type="checkbox" />
                  <label>Ghi nhớ đăng nhập</label>
                </div>
              </div>
            </form>
          </div>

          {/* Mã giảm giá */}
          <div className="cupon_area">
            <h2>Có mã giảm giá?</h2>
            <input type="text" placeholder="Nhập mã giảm giá" />
            <a className="tp_btn" href="#">Áp dụng</a>
          </div>

          {/* Thanh toán */}
          <div className="billing_details">
            <div className="row">

              <div className="col-lg-8">
                <h3>Thông tin thanh toán</h3>

                <form className="row contact_form">

                  <div className="col-md-6 form-group">
                    <input className="form-control" placeholder="Họ" />
                  </div>

                  <div className="col-md-6 form-group">
                    <input className="form-control" placeholder="Tên" />
                  </div>

                  <div className="col-md-12 form-group">
                    <input className="form-control" placeholder="Tên công ty (nếu có)" />
                  </div>

                  <div className="col-md-6 form-group">
                    <input className="form-control" placeholder="Số điện thoại" />
                  </div>

                  <div className="col-md-6 form-group">
                    <input className="form-control" placeholder="Email" />
                  </div>

                  <div className="col-md-12 form-group">
                    <input className="form-control" placeholder="Địa chỉ" />
                  </div>

                  <div className="col-md-12 form-group">
                    <input className="form-control" placeholder="Thành phố" />
                  </div>

                  <div className="col-md-12 form-group">
                    <input className="form-control" placeholder="Mã bưu điện" />
                  </div>

                  <div className="col-md-12 form-group">
                    <textarea className="form-control" placeholder="Ghi chú đơn hàng" />
                  </div>

                </form>
              </div>

              {/* Đơn hàng */}
              <div className="col-lg-4">
                <div className="order_box">
                  <h2>Đơn hàng của bạn</h2>

                  <ul className="list">
                    <li>Sản phẩm <span>Tổng</span></li>
                    <li>Táo tươi x2 <span>$720</span></li>
                    <li>Trái cây x2 <span>$720</span></li>
                  </ul>

                  <ul className="list list_2">
                    <li>Tạm tính <span>$1440</span></li>
                    <li>Phí ship <span>$50</span></li>
                    <li>Tổng cộng <span>$1490</span></li>
                  </ul>

                  <div className="payment_item">
                    <input type="radio" name="pay" />
                    <label>Thanh toán khi nhận hàng</label>
                  </div>

                  <div className="payment_item">
                    <input type="radio" name="pay" />
                    <label>PayPal</label>
                  </div>

                  <div className="creat_account">
                    <input type="checkbox" />
                    <label>Tôi đồng ý với điều khoản</label>
                  </div>

                  <a className="primary-btn" href="#">
                    Thanh toán ngay
                  </a>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  )
}