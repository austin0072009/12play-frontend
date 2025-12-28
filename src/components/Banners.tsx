
import styles from "./Banners.module.css";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Banners({ banners = [] }: { banners?: any[] }) {
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

  if (!banners || banners.length === 0) return null;

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {banners.map((b, i) => (
          <div key={i} className={styles.sliderItem}>
            <img
              className={styles.sliderImage}
              src={b.img}
              alt=""
              onClick={() => {
                if (b.href) window.open(b.href, "_blank");
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
