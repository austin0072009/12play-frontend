import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Banners.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Banners() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    arrows: false,
    autoplaySpeed: 3000,
    cssEase: "linear",
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        <div className={styles.sliderItem}>
          <img
            className={styles.sliderImage}
            src="../assets/images/banner.webp"
            alt=""
          />
        </div>
        <div className={styles.sliderItem}>
          <img
            className={styles.sliderImage}
            src="../assets/images/banner1.webp"
            alt=""
          />
        </div>
      </Slider>
    </div>
  );
}
