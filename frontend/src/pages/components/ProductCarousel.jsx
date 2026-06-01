import dynamic from "next/dynamic";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });

const ProductCarousel = () => {
  const options = {
    items: 1,
    autoplay: false,
    autoplayTimeout: 5000,
    loop: true,
    nav: true,
    dots: false,
    navText: [
      "<img src='assets/img/product/prev.png' alt='Trước' class='prev-product'/>",
      "<img src='assets/img/product/next.png' alt='Sau' class='next-product'/>"
    ]
  };

  return (
    <section>
      <style>{`
        .next-product{
          position: absolute;
          top: 6.5%;
          right: 35%;
          opacity: .3;
        }
        .prev-product{
          position: absolute;
          top: 6.5%;
          left: 35%;
          opacity: .3;
        }
        .next-product:hover , .prev-product:hover{
          opacity: 1;
        }
      `}</style>

      <OwlCarousel className="active-product-area section_gap" {...options}>

        {/* Slide Sản phẩm mới */}
        <div className="single-product-slider">
          <div className="container">

            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <div className="section-title">
                  <h1>Sản phẩm mới nhất</h1>
                  <p>Khám phá các sản phẩm mới với thiết kế hiện đại và chất lượng cao.</p>
                </div>
              </div>
            </div>

            <div className="row">

              {/* product item */}
              {[1,2,3,4,5,6,7,8].map((item) => (
                <div className="col-lg-3 col-md-6" key={item}>
                  <div className="single-product">
                    <img className="img-fluid" src={`assets/img/product/p${item}.jpg`} alt="" />
                    <div className="product-details">
                      <h6>Giày thể thao adidas thời trang</h6>

                      <div className="price">
                        <h6>3.500.000đ</h6>
                        <h6 className="l-through">4.200.000đ</h6>
                      </div>

                      <div className="prd-bottom">
                        <a href="" className="social-info">
                          <span className="ti-bag" />
                          <p className="hover-text">Thêm vào giỏ</p>
                        </a>
                        <a href="" className="social-info">
                          <span className="lnr lnr-heart" />
                          <p className="hover-text">Yêu thích</p>
                        </a>
                        <a href="" className="social-info">
                          <span className="lnr lnr-sync" />
                          <p className="hover-text">So sánh</p>
                        </a>
                        <a href="" className="social-info">
                          <span className="lnr lnr-move" />
                          <p className="hover-text">Xem chi tiết</p>
                        </a>
                      </div>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Slide sắp ra mắt (giữ đơn giản lại) */}
        <div className="single-product-slider">
          <div className="container">

            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <div className="section-title">
                  <h1>Sản phẩm sắp ra mắt</h1>
                  <p>Các sản phẩm mới sẽ được cập nhật trong thời gian tới.</p>
                </div>
              </div>
            </div>

            <div className="row">

              {[1,2,3,4].map((item) => (
                <div className="col-lg-3 col-md-6" key={item}>
                  <div className="single-product">
                    <img className="img-fluid" src={`assets/img/product/p${item}.jpg`} alt="" />

                    <div className="product-details">
                      <h6>Sản phẩm mới đang cập nhật</h6>

                      <div className="price">
                        <h6>--</h6>
                        <h6 className="l-through">--</h6>
                      </div>

                      <div className="prd-bottom">
                        <a href="" className="social-info">
                          <span className="ti-bag" />
                          <p className="hover-text">Thông báo</p>
                        </a>
                        <a href="" className="social-info">
                          <span className="lnr lnr-heart" />
                          <p className="hover-text">Quan tâm</p>
                        </a>
                        <a href="" className="social-info">
                          <span className="lnr lnr-move" />
                          <p className="hover-text">Xem trước</p>
                        </a>
                      </div>

                    </div>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </div>

      </OwlCarousel>
    </section>
  );
};

export default ProductCarousel;