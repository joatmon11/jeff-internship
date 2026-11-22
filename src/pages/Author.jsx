import { useState, useEffect } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import Skeleton from "../components/UI/Skeleton";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";

const ProfileSkeleton = () => {
  return (
    <div className="profile_avatar">
      <Skeleton width="150px" height="150px" borderRadius="100%" />
      <div className="profile_name">
        <div>
          <div className="mb10">
            <Skeleton width="180px" height="24px" borderRadius="4px" />
          </div>
          <div className="mb10">
            <Skeleton width="110px" height="16px" borderRadius="4px" />
          </div>
          <Skeleton width="200px" height="16px" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
};

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!authorId) {
      setLoading(false);
      return;
    }

    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);
      setAuthor(null);
      setFollowing(false);
      try {
        const response = await Axios.get(API_URL, {
          params: { author: authorId },
        });
        setAuthor(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [authorId]);

  const handleFollowClick = (e) => {
    e.preventDefault();
    setFollowing(!following);
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    {loading ? (
                      <ProfileSkeleton />
                    ) : author ? (
                      <div className="profile_avatar">
                        <img src={author.authorImage} alt={author.authorName} />

                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {author.authorName}
                            <span className="profile_username">
                              @{author.tag}
                            </span>
                            <span id="wallet" className="profile_wallet">
                              {author.address}
                            </span>
                            <button id="btn_copy" title="Copy Text">
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {loading ? (
                          <Skeleton
                            width="100px"
                            height="16px"
                            borderRadius="4px"
                          />
                        ) : (
                          author &&
                          `${author.followers + (following ? 1 : 0)} followers`
                        )}
                      </div>
                      <Link
                        to="#"
                        className="btn-main"
                        onClick={handleFollowClick}
                      >
                        {following ? "Unfollow" : "Follow"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems
                    author={author}
                    loading={loading}
                    error={error}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
