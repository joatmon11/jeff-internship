import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import "./AuthorItems.css";

const SkeletonCard = () => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div className="nft__item">
        <Skeleton width="100%" height="350px" borderRadius="8px" />
        <div className="nft__item_info">
          <div className="ai-skeleton-title">
            <Skeleton width="60%" height="16px" borderRadius="4px" />
          </div>
          <div className="ai-skeleton-price">
            <Skeleton width="30%" height="14px" borderRadius="4px" />
          </div>
        </div>
      </div>
    </div>
  );
};



const AuthorItems = ({ author, loading, error}) => {
  const items = author ? author.nftCollection : [];

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {error && <p className="text-center">Error: {error}</p>}
          {!error &&
            (loading
              ? new Array(8)
                  .fill(0)
                  .map((_, index) => <SkeletonCard key={index} />)
              : items.map((item) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    key={item.id}
                  >
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link to="">
                          <img
                            className="lazy"
                            src={author.authorImage}
                            alt={author.authorName}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
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
                            alt={item.title}
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
            {!loading && !error && items.length === 0 && (
              <p className="text-center">No item to show.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
