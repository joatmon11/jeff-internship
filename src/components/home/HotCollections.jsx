import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./HotCollections.css";
import Skeleton from "../UI/Skeleton.jsx";

const NextArrow = ({ onClick }) => (
  <button
    type="button"
    className="hc-arrow hc-arrow-next"
    onClick={onClick}
    aria-label="Next"
  >
    &rsaquo;
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    className="hc-arrow hc-arrow-prev"
    onClick={onClick}
    aria-label="Previous"
  >
    &lsaquo;
  </button>
);

const SkeletonCard = () => (
  <div className="hc-slide">
    <div className="nft_coll">
      <div className="nft_wrap">
        <Skeleton width="100%" height="200px" />
      </div>
      <div className="nft_coll_pp hc-skeleton-avatar">
        <Skeleton width="60px" height="60px" borderRadius="100%" />
      </div>
      <div className="nft_coll_info">
        <div className="hc-skeleton-title">
          <Skeleton width="60%" height="16px" borderRadius="4px" />
        </div>
        <div>
          <Skeleton width="30%" height="14px" borderRadius="4px" />
        </div>
      </div>
    </div>
  </div>
);

const getSlidesToShow = () => {
  if (window.innerWidth <= 576) return 1;
  if (window.innerWidth <= 992) return 2;
  return 4;
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections",
        );
        setCollections(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {error && (
            <div className="col-lg-12 text-center">
              <p>Error: {error}</p>
            </div>
          )}

          {!error && (
            <div className="col-lg-12 hc-slider-wrap">
              {loading ? (
                <div
                  className="hc-skeleton-row"
                  style={{
                    gridTemplateColumns: `repeat(${slidesToShow}, 1fr)`,
                  }}
                  aria-busy="true"
                >
                  {new Array(slidesToShow).fill(0).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : (
                <Slider key={slidesToShow} {...settings}>
                  {collections.map((collection) => (
                    <div key={collection.id}>
                      <div className="hc-slide">
                        <div className="nft_coll">
                          <div className="nft_wrap">
                            <Link to="/item-details">
                              <img
                                src={collection.nftImage}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="nft_coll_pp">
                            <Link to="/author">
                              <img
                                className="lazy pp-coll"
                                src={collection.authorImage}
                                alt=""
                              />
                            </Link>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <Link to="/explore">
                              <h4>{collection.title}</h4>
                            </Link>
                            <span>ERC-{collection.code}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
