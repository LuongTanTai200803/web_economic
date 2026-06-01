import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

const ExclusiveDeal = () => {
  const options = {
    items: 1,
    autoplay: false,
    autoplayTimeout: 5000,
    loop: true,
    nav: true,
    dots: false,
    navText: [
      "<img src='assets/img/product/prev.png' alt='Trước' class='prev'/>",
      "<img src='assets/img/product/next.png' alt='Sau' class='next'/>"
    ]
  };

  return (
    <>
      {/* Start exclusive deal Area */}
      <style>{`
        .next{
          position: absolute;
          top: 50%;
          right: 10%;
          opacity: .3;
        }
        .prev{
          position: absolute;
          top: 50%;
          left: 10%;
          opacity: .3;
        }
        .next:hover , .prev:hover{
          opacity: 1;
        }
      `}</style>

      <section className="exclusive-deal-area">
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center">

            {/* LEFT */}
            <div className="col-lg-6 no-padding exclusive-left">
              <div className="row clock_sec clockdiv" id="clockdiv">

                <div className="col-lg-12">
                  <h1>Ưu đãi đặc biệt sắp kết thúc!</h1>
                  <p>Khám phá các sản phẩm thân thiện với môi trường và giá cực tốt.</p>
                </div>

                <div className="col-lg-12">
                  <div className="row clock-wrap">

                    <div className="col clockinner1 clockinner">
                      <h1 className="days">150</h1>
                      <span className="smalltext">Ngày</span>
                    </div>

                    <div className="col clockinner clockinner1">
                      <h1 className="hours">23</h1>
                      <span className="smalltext">Giờ</span>
                    </div>

                    <div className="col clockinner clockinner1">
                      <h1 className="minutes">47</h1>
                      <span className="smalltext">Phút</span>
                    </div>

                    <div className="col clockinner clockinner1">
                      <h1 className="seconds">59</h1>
                      <span className="smalltext">Giây</span>
                    </div>

                  </div>
                </div>

              </div>

              <a href="#" className="primary-btn">
                Mua ngay
              </a>
            </div>

            {/* RIGHT */}
            <div className="col-lg-6 no-padding exclusive-right">
              <OwlCarousel className="active-exclusive-product-slider" {...options}>

                {/* slide 1 */}
                <div className="single-exclusive-slider">
                  <img className="img-fluid" src="assets/img/product/e-p1.png" alt="" />
                  <div className="product-details">
                    <div className="price">
                      <h6>$150.00</h6>
                      <h6 className="l-through">$210.00</h6>
                    </div>

                    <h4>
                      Giày Adidas Hammer dành cho người chơi thể thao
                    </h4>

                    <div className="add-bag d-flex align-items-center justify-content-center">
                      <a className="add-btn" href="#">
                        <span className="ti-bag"></span>
                      </a>
                      <span className="add-text text-uppercase">
                        Thêm vào giỏ
                      </span>
                    </div>
                  </div>
                </div>

                {/* slide 2 */}
                <div className="single-exclusive-slider">
                  <img className="img-fluid" src="assets/img/product/e-p1.png" alt="" />
                  <div className="product-details">
                    <div className="price">
                      <h6>$150.00</h6>
                      <h6 className="l-through">$210.00</h6>
                    </div>

                    <h4>
                      Giày Adidas Hammer dành cho người chơi thể thao
                    </h4>

                    <div className="add-bag d-flex align-items-center justify-content-center">
                      <a className="add-btn" href="#">
                        <span className="ti-bag"></span>
                      </a>
                      <span className="add-text text-uppercase">
                        Thêm vào giỏ
                      </span>
                    </div>
                  </div>
                </div>

              </OwlCarousel>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ExclusiveDeal;