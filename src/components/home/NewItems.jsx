import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./NewItems.css";

const NextArrow = ({ onClick }) => (
  <button
    type="button"
    className="ni-arrow ni-arrow-next"
    onClick={onClick}
    aria-label="Next"
  >
    &rsaquo;
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    className="ni-arrow ni-arrow-prev"
    onClick={onClick}
    aria-label="Previous"
  >
    &lsaquo;
  </button>
);

const getTimeLeft = (expiryDate) => {
  if (!expiryDate) return "";
  const remaining = expiryDate - Date.now();
  if (remaining <= 0) return "Expired";

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

const Countdown = ({ expiryDate}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiryDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(expiryDate));
    }, 1000);

    return () => clearInterval(id);
  }, [expiryDate]);

  if (!timeLeft) return null;
  return <div className="de_countdown">{timeLeft}</div>
};

const SkeletonCard = () => (
  <div className="ni-skeleton-card">
    <div className="ni-skeleton ni-skeleton-image"></div>
    <div className="ni-skeleton ni-skeleton-avatar"></div>
    <div className="ni-skeleton ni-skeleton-title"></div>
    <div className="ni-skeleton ni-skeleton-price"></div>
  </div>
);

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const response = await Axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
        );
        setNewItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading && (
            <div className="col-lg-12 text-center" aria-busy="true">
              <div className="ni-skeleton-row">
                {[0, 1, 2, 3].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="col-lg-12 text-center">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="col-lg-12 ni-slider-wrap">
              <Slider {...settings}>
                {newItems.map((item) => (
                  <div key={item.id}>
                    <div className="ni-slide">
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <Link
                            to="/author"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Creator: Monica Lucas"
                          >
                            <img
                              className="lazy"
                              src={item.authorImage}
                              alt=""
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <Countdown expiryDate={item.expiryDate} />

                        <div className="nft__item_wrap">
                          <div className="nft__item_extra">
                            <div className="nft__item_buttons">
                              <button>Buy Now</button>
                              <div className="nft__item_share">
                                <h4>Share</h4>
                                <a href="" target="_blank" rel="noreferrer">
                                  <i className="fa fa-facebook fa-lg"></i>
                                </a>
                                <a href="" target="_blank" rel="noreferrer">
                                  <i className="fa fa-twitter fa-lg"></i>
                                </a>
                                <a href="">
                                  <i className="fa fa-envelope fa-lg"></i>
                                </a>
                              </div>
                            </div>
                          </div>

                          <Link to="/item-details">
                            <img
                              src={item.nftImage}
                              className="lazy nft__item_preview"
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="nft__item_info">
                          <Link to="/item-details">
                            <h4>{item.title}</h4>
                          </Link>
                          <div className="nft__item_price">
                            {item.price} ETH
                          </div>
                          <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                            <span>{item.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
