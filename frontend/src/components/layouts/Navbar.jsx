import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Link from 'next/link';

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    $("#search_input_box").hide();

    $("#search").on("click", function () {
      $("#search_input_box").slideToggle();
      $("#search_input").focus();
    });

    $("#close_search").on("click", function () {
      $('#search_input_box').slideUp(500);
    });

    return () => {
      $("#search").off("click");
      $("#close_search").off("click");
    };
  }, []);

  return (
    <div
      id="undefined-sticky-wrapper"
      className={`sticky-wrapper ${isSticky ? 'is-sticky' : ''}`}
      style={{ height: '80px' }}
    >
      <header
        className={`header_area sticky-header ${isSticky ? 'sticky-header-active' : ''}`}
        style={{
          width: '100%',
          position: isSticky ? 'fixed' : 'relative',
          top: 0,
          transition: 'all 0.3s'
        }}
      >
        <div className="main_menu">
          <nav className="navbar navbar-expand-lg navbar-light main_box">
            <div className="container">

              <a className="navbar-brand logo_h" href="/">
                <img src="/assets/img/logo.png" alt="Logo" />
              </a>

              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Mở menu"
              >
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>

              <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
                <ul className="nav navbar-nav menu_nav ml-auto">

                  <li className="nav-item active">
                    <Link className="nav-link" href="/">
                      Trang chủ
                    </Link>
                  </li>

                  <li className="nav-item submenu dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                      Cửa hàng
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link className="nav-link" href="/category">Danh mục sản phẩm</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/product_detail">Chi tiết sản phẩm</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/checkout">Thanh toán</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/cart">Giỏ hàng</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/confirmation">Xác nhận</Link>
                      </li>
                    </ul>
                  </li>

                  {/* <li className="nav-item submenu dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                      Bài viết
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link className="nav-link" href="/blog">Blog</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/blog-detail">Chi tiết blog</Link>
                      </li>
                    </ul>
                  </li> */}

                  <li className="nav-item submenu dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                      Trang
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link className="nav-link" href="/login">Đăng nhập</Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link className="nav-link" href="/tracking">Theo dõi đơn hàng</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/elements">Thành phần UI</Link>
                      </li> */}
                    </ul>
                  </li>

                  {/* <li className="nav-item">
                    <Link className="nav-link" href="/contact">
                      Liên hệ
                    </Link>
                  </li> */}
                </ul>

                <ul className="nav navbar-nav navbar-right">
                  <li className="nav-item">
                    <a href="#" className="cart">
                      <span className="ti-bag" />
                    </a>
                  </li>
                  <li className="nav-item">
                    <button className="search">
                      <span className="lnr lnr-magnifier" id="search" />
                    </button>
                  </li>
                </ul>

              </div>
            </div>
          </nav>
        </div>

        <div className="search_input" id="search_input_box">
          <div className="container">
            <form className="d-flex justify-content-between">
              <input
                type="text"
                className="form-control"
                id="search_input"
                placeholder="Tìm kiếm..."
              />
              <button type="submit" className="btn" />
              <span
                className="lnr lnr-cross"
                id="close_search"
                title="Đóng tìm kiếm"
              />
            </form>
          </div>
        </div>

      </header>
    </div>
  );
}