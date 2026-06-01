import React from 'react'
import PageBanner from './components/PageBanner'

export default function confirmation() {
  return (
    <>
      <PageBanner page="Xác nhận đơn hàng" header="Đặt hàng thành công" />

      <section className="order_details section_gap">
        <div className="container">

          <h3 className="title_confirmation">
            Cảm ơn bạn. Đơn hàng của bạn đã được tiếp nhận.
          </h3>

          <div className="row order_d_inner">

            {/* Thông tin đơn hàng */}
            <div className="col-lg-4">
              <div className="details_item">
                <h4>Thông tin đơn hàng</h4>
                <ul className="list">
                  <li><span>Mã đơn</span> : 60235</li>
                  <li><span>Ngày đặt</span> : 20/05/2026</li>
                  <li><span>Tổng tiền</span> : 2,210 USD</li>
                  <li><span>Thanh toán</span> : Chuyển khoản</li>
                </ul>
              </div>
            </div>

            {/* Địa chỉ thanh toán */}
            <div className="col-lg-4">
              <div className="details_item">
                <h4>Địa chỉ thanh toán</h4>
                <ul className="list">
                  <li><span>Đường</span> : 56/8</li>
                  <li><span>Thành phố</span> : Los Angeles</li>
                  <li><span>Quốc gia</span> : Mỹ</li>
                  <li><span>Mã bưu điện</span> : 36952</li>
                </ul>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="col-lg-4">
              <div className="details_item">
                <h4>Địa chỉ giao hàng</h4>
                <ul className="list">
                  <li><span>Đường</span> : 56/8</li>
                  <li><span>Thành phố</span> : Los Angeles</li>
                  <li><span>Quốc gia</span> : Mỹ</li>
                  <li><span>Mã bưu điện</span> : 36952</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Chi tiết đơn hàng */}
          <div className="order_details_table">
            <h2>Chi tiết đơn hàng</h2>

            <div className="table-responsive">
              <table className="table">

                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>Quả việt quất tươi</td>
                    <td>x2</td>
                    <td>$720</td>
                  </tr>

                  <tr>
                    <td>Táo tươi</td>
                    <td>x2</td>
                    <td>$720</td>
                  </tr>

                  <tr>
                    <td>Dâu tây</td>
                    <td>x2</td>
                    <td>$720</td>
                  </tr>

                  <tr>
                    <td><strong>Tạm tính</strong></td>
                    <td></td>
                    <td>$2160</td>
                  </tr>

                  <tr>
                    <td><strong>Phí ship</strong></td>
                    <td></td>
                    <td>$50</td>
                  </tr>

                  <tr>
                    <td><strong>Tổng cộng</strong></td>
                    <td></td>
                    <td><strong>$2210</strong></td>
                  </tr>

                </tbody>

              </table>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}