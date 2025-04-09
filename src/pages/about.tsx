import React from "react";
import { Helmet } from "react-helmet";
import "styles/about.css";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | QuickQuill</title>
        <meta name="description" content="About page" />
      </Helmet>
      <div className="about-container">
        <section className="about-hero">
          <h1>About QuickQuill Notes</h1>
          <p>A modern note-taking app for your daily thoughts and ideas</p>
        </section>

        <section className="features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="icon">📝</span>
              <h3>Markdown Support</h3>
              <p>Write and format your notes using Markdown syntax</p>
            </div>
            <div className="feature-card">
              <span className="icon">💾</span>
              <h3>Auto-Save</h3>
              <p>Never lose your work with automatic saving</p>
            </div>
            <div className="feature-card">
              <span className="icon">🎨</span>
              <h3>Clean Interface</h3>
              <p>Distraction-free writing environment</p>
            </div>
          </div>
        </section>

        <section className="tech-stack">
          <h2>Built With</h2>
          <div className="tech-list">
            <span>React</span>
            <span>TypeScript</span>
            <span>Redux</span>
            <span>React Router</span>
          </div>
        </section>

        <section className="contact">
          <h2>Get in Touch</h2>
          <p>
            Have questions or suggestions? Email us at contact@quickquill.com
          </p>
        </section>
      </div>
    </>
  );
};

export default About;
