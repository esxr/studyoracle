import React from "react";
import { Link } from "react-router-dom";

export const HeroBanner = () => {
  const logo = "https://cdn.auth0.com/blog/developer-hub/react-logo.svg";

  return (
    <div className="hero-banner hero-banner--pink-yellow">
      <div className="hero-banner__logo">
        <img className="hero-banner__image" src={logo} alt="React logo" />
      </div>
      <h1 className="hero-banner__headline">UQ Study Oracle</h1>
      <p className="hero-banner__description">
      <h3>Help in development</h3>
            <b>Discord Community:</b> Join the <a style={{ color: "blue" }} href="https://discord.gg/TD6HfMaq3R">StudyOracle Discord community</a> for discussions, collaboration, and assistance (moderators wanted).
            <br /><b>Reddit Community:</b> Join the <a style={{ color: "blue" }} href="https://www.reddit.com/r/studyoracle/">StudyOracle Subreddit</a> (moderators wanted).
            <br /><b>WhatsApp Group:</b> Join our <a style={{ color: "blue" }} href="https://chat.whatsapp.com/LBhukxklTQ6IgECB8Fp7BU">WhatsApp Group</a>.
            <br /><b>Email:</b> Email us at <a style={{ color: "blue" }} href="mailto:info@studyoracle.com">info@studyoracle.com</a> with your ideas.
            <br />
      </p>
      <Link
        id="code-sample-link"
        to={{ pathname: "/chat" }}
        className="button button--secondary">
        Try it →
      </Link>
    </div>
  );
};
