import React from 'react'

export default function Footer() {
  return (
    <>
      <footer className="footer-area section_gap">
        <div className="container">
          <div className="row">

            {/* Giới thiệu */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h6>Giới thiệu</h6>
                <p>
                  Website bán giày online với giao diện hiện đại, dễ sử dụng và thân thiện với người dùng.
                </p>
              </div>
            </div>

            {/* Newsletter (giữ nhưng đơn giản hóa) */}
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h6>Bản tin</h6>
                <p>Nhận thông tin khuyến mãi mới nhất</p>

                <form className="form-inline">
                  <div className="d-flex flex-row">
                    <input
                      className="form-control"
                      placeholder="Nhập email"
                      type="email"
                    />
                    <button className="click-btn btn btn-default">
                      →
                    </button>
                  </div>
                </form>

              </div>
            </div>

            {/* Ảnh Instagram */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h6>Instagram</h6>
                <ul className="instafeed d-flex flex-wrap">
                  <li><img src="/assets/img/i1.jpg" alt="" /></li>
                  <li><img src="/assets/img/i2.jpg" alt="" /></li>
                  <li><img src="/assets/img/i3.jpg" alt="" /></li>
                  <li><img src="assets/img/i4.jpg" alt="" /></li>
                </ul>
              </div>
            </div>

            {/* Mạng xã hội */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h6>Theo dõi</h6>
                <p>Mạng xã hội</p>

                <div className="footer-social d-flex align-items-center">
                  <a href="#"><i className="fa fa-facebook" /></a>
                  <a href="#"><i className="fa fa-twitter" /></a>
                  <a href="#"><i className="fa fa-instagram" /></a>
                  <a href="#"><i className="fa fa-youtube" /></a>
                </div>

              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="footer-bottom d-flex justify-content-center align-items-center flex-wrap">
            <p className="footer-text m-0">
              © 2026 Website đồ án bán giày - React + Spring Boot
            </p>
          </div>

        </div>
      </footer>
    </>
  )
}