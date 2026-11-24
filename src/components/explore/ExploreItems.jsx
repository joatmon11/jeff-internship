import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import "./ExploreItems.css";
import Countdown from "../UI/Countdown";
import Skeleton from "../UI/Skeleton.jsx";

const SkeletonCard = () => (
  <div
    className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 ei-item"
    style={{ display: "block", backgroundSize: "cover" }}
  >
    <div className="nft__item">
      <Skeleton width="100%" height="350px" borderRadius="8px" />
      <div className="nft__item_info">
        <div className="ei-skeleton-title">
          <Skeleton width="60%" height="16px" borderRadius="4px" />
        </div>
        <div className="ei-skeleton-price">
          <Skeleton width="30%" height="14px" borderRadius="4px" />
        </div>
      </div>
    </div>
  </div>
);

const ExploreItems = () => {
  const [exploreItems, setExploreItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchExploreItems = async () => {
      setLoading(true);
      setError(null);
      const url = filter
        ? `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${filter}`
        : "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";
      try {
        const response = await Axios.get(url);
        setExploreItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreItems();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setVisibleCount(8);
  };

  const handleLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <>
      <div>
        <select id="filter-items" value={filter} onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {error && (
        <div className="col-lg-12 text-center">
          <p>Error: {error}</p>
        </div>
      )}

      {!error &&
        (loading
          ? new Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
          : exploreItems.slice(0, visibleCount).map((item) => (
              <div
                key={item.id}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 ei-item"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                    >
                      <img className="lazy" src={item.authorImage} alt="" />
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
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            )))}
      {!loading && visibleCount < exploreItems.length && (
        <div className="col-md-12 text-center">
          <Link
            to=""
            id="loadmore"
            className="btn-main lead"
            onClick={handleLoadMore}
          >
            Load more
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
