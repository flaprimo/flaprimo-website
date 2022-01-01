import React, { useState, useEffect, useRef } from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import MatrixCanvas from "../components/MatrixCanvas";
import "bulma/css/bulma.css";

// Window Size
let defaultHeight
let defaultWidth

if (typeof window !== `undefined`) {
  defaultHeight = window.innerHeight
  defaultWidth = window.innerWidth
}

const useWindowSize = () => {
  const [dimensions, setDimensions] = useState({
    windowHeight: defaultHeight,
    windowWidth: defaultWidth,
  })

  useEffect(() => {
    const handler = () => setDimensions({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    })

    window.addEventListener(`load`, handler)
    window.addEventListener(`resize`, handler)
    return () => {
      window.removeEventListener(`load`, handler);
      window.removeEventListener(`resize`, handler);
    }
  }, [])

  return dimensions
}

function MagicMirrorPage(props) {
  const siteTitle = props.data.site.siteMetadata.title;
  const title = `Magic Mirror | ${siteTitle}`;

  const firstSection = useRef();
  const secondSection = useRef();
  const thirdSection = useRef();

  const [section, setSection] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    console.log(section, '- Has changed')

    if (section === 0)
      firstSection.current.scrollIntoView({ behavior: 'smooth' });
    else if (section === 1)
      secondSection.current.scrollIntoView({ behavior: 'smooth' });
    else if (section === 2)
      thirdSection.current.scrollIntoView({ behavior: 'smooth' });
  }, [section]) // <-- here put the parameter to listen

  useEffect(() => {
    const sectionTimer = setInterval(() => {
      setSection((section + 1) % 3);
    }, 5000);

    return () => {
      clearInterval(sectionTimer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, [section]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000)

    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, []);

  const windowSize = useWindowSize();

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section ref={firstSection} className="hero is-danger is-fullheight">
        <div className="hero-body">
          <p className="title">
            It's a kind of magic ✨
          </p>
        </div>
      </section>
      <section ref={secondSection} className="hero is-warning is-fullheight">
        <div className="hero-body">
          <p className="title">
            {time.toLocaleString()}
          </p>
        </div>
      </section>
      <section ref={thirdSection} className="hero is-white is-fullheight">
        <div className="hero-body" style={{padding: 0}}>
            <MatrixCanvas height={windowSize.windowHeight} width={windowSize.windowWidth} />
        </div>
      </section> 
    </div>
  );
}

export default MagicMirrorPage;

export const pageQuery = graphql`
  query magicMirrorPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

MagicMirrorPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
