import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./HotCollections.css";

const NextArrow = ({ onClick }) => (
  <button type="button" className="hc-arrow hc-arrow=next" onClick={onClick} aria-label="Next">
    &rsaquo;
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button type="button" className="hc-arrow hc-arrow-prev" onClick={onClick} aria-label="Previous">
    &lsaquo;
  </button>
);

const HotCollections = () => {
  const [collections, setCollections] = useState([0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections");
        setCollections(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
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
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading && <div className="col-lg-12 text-center"><p>Loading...</p></div>}
          {error && <div className="col-lg-12 text-center"><p>Error: {error}</p></div>}


          {!loading && !error && (
            <div className="col-lg-12 hc-slider-wrap">
              <Slider {...settings}>
                {collections.map((collection) => (
                  <div key={collection.id}>
                    <div className="hc-slide">
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <Link to="/item-details">
                            <img src={collection.nftImage} 
                            className="lazy img-fluid" alt="" />
                          </Link>
                        </div>
                        <div className="nft_coll_pp">
                          <Link to="/author">
                            <img className="lazy pp-coll" src={collection.authorImage} alt="" />
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
