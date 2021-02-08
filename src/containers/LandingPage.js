import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import StarRatingComponent from "react-star-rating-component";

export default function LandingPage() {
  const [allPosts, setAllPosts] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      try {
        const allPosts = await loadAllPosts();
        setAllPosts(allPosts);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, []);

  function loadAllPosts() {
    return API.get("posts", "/posts/all");
  }

  function renderPostsList(allPosts) {
    console.log(allPosts);
    return (
      <div>
        {allPosts.Items.map(
          ({
            postId,
            postBlurb,
            postLink,
            postKeywords,
            postLanguage,
            postRating,
            attachment,
            createdAt,
          }) => (
            <ListGroup.Item>
              <span className="font-weight-bold">
                {postBlurb.trim().split("\n")[0]}
                <br></br>
                <a href={postLink} target="_blank" rel="noopener noreferrer">
                  {postLink.trim().split("\n")[0]}
                </a>
                <br></br>
              </span>
              <span className="text-muted">
                Language: {postLanguage}
                <br></br>
                Tags: {postKeywords}
                <br></br>
                Rating:
                <br />
                <StarRatingComponent
                  name={postId}
                  editing={false}
                  renderStarIcon={() => <span>⭐</span>}
                  starCount={postRating}
                />
                <p>Attachment: <a target="_blank" rel="noopener noreferrer" href={attachment}/></p>
              </span>
              <br />
            </ListGroup.Item>
          )
        )}
      </div>
    );
  }

  function renderPosts() {
    return (
      <div className="posts">
        <h2 className="pb-3 mt-4 mb-3">All Posts</h2>
        <ListGroup>{!isLoading && renderPostsList(allPosts)}</ListGroup>
      </div>
    );
  }
  return (
    <div className="Home">
      <div className="lander">
        <h1>Post Feed</h1>
        <div className="d-block justify-content-center">{renderPosts()}</div>
      </div>
    </div>
  );
}
