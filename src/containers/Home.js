import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import NewPost from "./NewPost";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { BsFileEarmarkPlus } from "react-icons/bs";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const posts = await loadPosts();
        setPosts(posts);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  function loadPosts() {
    return API.get("posts", "/posts");
  }

  function renderPostsList(posts) {
    return (
      <div className="col-7 ">
        <LinkContainer to="/posts/new">
          <ListGroup.Item action className="py-1 text-nowrap text-truncate">
            <BsFileEarmarkPlus size={17} />
            <span className="ml-2 font-weight-bold">Create new post</span>
          </ListGroup.Item>
        </LinkContainer>
        {posts.map(
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
            <LinkContainer key={postId} to={`/posts/${postId}`}>
              <ListGroup.Item action>
                <span className="font-weight-bold">
                  {postBlurb.trim().split("\n")[0]}
                  <br></br>
                  <a href={postLink}>{postLink.trim().split("\n")[0]}</a>
                  <br></br>
                </span>
                <span className="text-muted">
                  Tags: {postKeywords}
                  <br></br>
                  Rating: {postRating}
                </span>
                <br />
              </ListGroup.Item>
            </LinkContainer>
          )
        )}
        ;
      </div>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Resource Hub</h1>
        <p className="text-muted">
          A place to share helpful information for developers.
        </p>
      </div>
    );
  }

  function renderPosts() {
    return (
      <div className="posts">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Posts</h2>
        <ListGroup>{!isLoading && renderPostsList(posts)}</ListGroup>
      </div>
    );
  }
  return (
    <div className="Home">
      <div className="lander">
        <h1>Homepage</h1>
        <div className="d-block justify-content-center">
          {isAuthenticated ? renderPosts() : renderLander()}
        </div>
      </div>
    </div>
  );
}
