import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Skeleton from "../UI/Skeleton.jsx"


const SkeletonSeller = () => {
  return (
    <li>
      <div className="author_list_pp">
        <Skeleton width="50px" height="50px" borderRadius="50%" />
      </div>
      <div className="author_list_info">
        <div className="mb10">
          <Skeleton width="110px" height="14px" borderRadius="4px" />
        </div>
        <Skeleton width="60px" height="12px" borderRadius="4px" />
      </div>
    </li>
  );
};

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await Axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers",
        );
        setSellers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            {error && <p className="text-center">Error: {error}</p>}
            {!error && (
              <ol className="author_list">
                {loading
                  ? new Array(12)
                      .fill(0)
                      .map((_, index) => <SkeletonSeller key={index} />)
                  : sellers.map((seller) => (
                      <li key={seller.id}>
                        <div className="author_list_pp">
                          <Link to={`/author/${seller.authorId}`}>
                            <img
                              className="lazy pp-author"
                              src={seller.authorImage}
                              alt={seller.authorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${seller.authorId}`}>
                            {seller.authorName}
                          </Link>
                          <span>{seller.price} ETH</span>
                        </div>
                      </li>
                    ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
