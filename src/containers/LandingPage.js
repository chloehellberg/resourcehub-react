import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import StarRatingComponent from "react-star-rating-component";
import YouTube from "react-youtube";
import SpotifyPlayer from "react-spotify-player";
import { TwitterTweetEmbed } from "react-twitter-embed";

export function getTweetId(arg) {
  let tweetId = arg.split("/")[5];
  return tweetId;
}

  export function extractVideoID(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    console.log(url);
    let match = url.match(regExp);
    if (match && match[7].length === 11) {
      return match[7];
    } else {
    }
  }
export default function LandingPage() {
  const playerSize = {
    width: "70%",
  };



  const [allPosts, setAllPosts] = useState([]);
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
                {postLink.includes("youtube.com") && (
                  <em>
                    <YouTube videoId={extractVideoID(postLink)}></YouTube>
                  </em>
                )}
                {postLink.includes("open.spotify.com") && (
                  <React.Fragment>
                    <br></br>
                    <SpotifyPlayer
                      view="list"
                      className="no-overflow"
                      theme="white"
                      scrolling="no"
                      // view ='coverart'
                      size={playerSize}
                      uri={postLink}
                    ></SpotifyPlayer>
                  </React.Fragment>
                )}
                {postLink.includes("twitter.com") && (
                  <TwitterTweetEmbed
                    tweetId={getTweetId(postLink)}
                  ></TwitterTweetEmbed>
                )}
                <p>
                  Posted at:{" "}
                  {new Date(createdAt).toLocaleString([], {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {/* <p>Attachment: <a target="_blank" rel="noopener noreferrer" href={attachment}/></p> */}
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
        <ListGroup>{!isLoading && renderPostsList(allPosts)}</ListGroup>
      </div>
    );
  }
  return (
    <div className="Home">
      <div className="lander">
        <h1 className="font-weight-bold pb-3 mt-4 mb-3">All Posts</h1>
        <div className="d-block justify-content-center">{renderPosts()}</div>
      </div>
    </div>
  );
}
