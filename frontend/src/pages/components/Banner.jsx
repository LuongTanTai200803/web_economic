import dynamic from 'next/dynamic';
import Script from 'next/script';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

const Banner = () => {
    const options = {
        items: 1,
        autoplay: false,
        autoplayTimeout: 5000,
        loop: true,
        nav: true,
        dots: false,
        navText: [
            "<img src='assets/img/banner/prev.png' alt='Trước' class='prev-banner'/>",
            "<img src='assets/img/banner/next.png' alt='Sau' class='next-banner'/>"
        ],
    };

    return (
        <section className="banner-area h-100">
            <style>{`
                .next-banner{
                    position: absolute;
                    top: -9px;
                    left: 46%;
                    opacity: 1;
                }
                .prev-banner{
                    position: absolute;
                    top: -9px;
                    right: 50px;
                    opacity: 1;
                }
                .next-banner:hover , .prev-banner:hover{
                    opacity: 1;
                }
                .owl-nav{
                    display:block !important;
                }
            `}</style>

            <div className="container">
                <div
                    className="row fullscreen align-items-center justify-content-start"
                    style={{ height: '738px' }}
                >
                    <div className="col-lg-12">

                        <OwlCarousel className="active-banner-slider" {...options}>

                            {/* Slide 1 */}
                            <div className="row single-slide align-items-center d-flex">
                                <div className="col-lg-5 col-md-6">
                                    <div className="banner-content">
                                        <h1>Bộ sưu tập Nike mới!</h1>

                                        <p>
                                            Khám phá bộ sưu tập giày thể thao mới nhất với thiết kế hiện đại,
                                            phong cách trẻ trung và hiệu năng vượt trội.
                                        </p>

                                        <div className="add-bag d-flex align-items-center">
                                            <a className="add-btn" href="#">
                                                <span className="lnr lnr-cross"></span>
                                            </a>
                                            <span className="add-text text-uppercase">
                                                Thêm vào giỏ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-7">
                                    <div className="banner-img">
                                        <img
                                            className="img-fluid"
                                            src="assets/img/banner/banner-img.png"
                                            alt="Banner"
                                        />
                                    </div>
                                </div>
                            </div>

                        </OwlCarousel>
                    </div>
                </div>
            </div>

            {/* giữ lại vì template đang phụ thuộc jQuery/owl build */}
            <Script
                src="https://code.jquery.com/jquery-3.6.0.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/assets/lib/owlcarousel/owl.carousel.min.js"
                strategy="afterInteractive"
            />
        </section>
    );
};

export default Banner;