import React from 'react'

export default function Features() {
  return (
    <>
      {/* start features Area */}
      <section className="features-area section_gap">
        <div className="container">
          <div className="row features-inner">

            {/* single features */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-features">
                <div className="f-icon">
                  <img src="assets/img/features/f-icon1.png" alt="" />
                </div>
                <h6>Giao hàng miễn phí</h6>
                <p>Miễn phí vận chuyển cho tất cả đơn hàng</p>
              </div>
            </div>

            {/* single features */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-features">
                <div className="f-icon">
                  <img src="assets/img/features/f-icon2.png" alt="" />
                </div>
                <h6>Chính sách đổi trả</h6>
                <p>Hỗ trợ đổi trả nhanh chóng và thuận tiện</p>
              </div>
            </div>

            {/* single features */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-features">
                <div className="f-icon">
                  <img src="assets/img/features/f-icon3.png" alt="" />
                </div>
                <h6>Hỗ trợ 24/7</h6>
                <p>Luôn sẵn sàng hỗ trợ khách hàng mọi lúc</p>
              </div>
            </div>

            {/* single features */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-features">
                <div className="f-icon">
                  <img src="assets/img/features/f-icon4.png" alt="" />
                </div>
                <h6>Thanh toán an toàn</h6>
                <p>Bảo mật thông tin thanh toán tuyệt đối</p>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* end features Area */}
    </>
  )
}