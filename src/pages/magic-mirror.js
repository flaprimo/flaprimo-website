import React, { useState, useEffect, useRef } from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import "bulma/css/bulma.css";
import cheerio from 'cheerio';
import axios from 'axios';
import me from "../../static/force-portrait-orientation.css";

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

function ArchillectFetch() {
  const [imageUrl, setImageUrl] = useState([]);
  const baseUrl = 'https://archillect.com/'

  const getArchiveMaxPostId = async() => {
    try {
      const response = await axios.get(baseUrl + 'archive');
      const $ = cheerio.load(response.data); 
      const maxPostId = $('#archive .post:first').attr('href').substring(1);
      console.log(maxPostId);
      
      return maxPostId;
    } catch (error) {
      console.error(error);
    }
  }

  const getArchiveRandomImage = async() => {
    const maxPostId = await getArchiveMaxPostId();
    if (!isNaN(maxPostId)) {
      const postId = Math.floor(Math.random() * (maxPostId - 0) + maxPostId);

      try {
        const response = await axios.get(baseUrl.concat(postId));
        const $ = cheerio.load(response.data); 
        const imageUrl = $('#ii').attr('src');
        console.log(imageUrl);
        
        return imageUrl;
      } catch (error) {
        console.error(error);
      }
    } else {
      return 'https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1175550351.jpg';
    }
  }

  useEffect(() => {
    async function fetchArchillectAPI() {
      const imageUrl = await getArchiveRandomImage();
      setImageUrl(imageUrl);
    }

    const grabImageTimer = setInterval(() => {
      fetchArchillectAPI();
    }, 10000);

    return () => {
      clearInterval(grabImageTimer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, [imageUrl]);

  return (
    <div className="archillect-bg-image" style={{
      backgroundSize: "contain",
      width: "100vw",
      height: "100vh",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.8)), url(" + imageUrl + ")"
    }}>
      <div className="archillect-image" style={{
        backgroundImage: "url(" + imageUrl + ")",
        backgroundSize: "contain",
        width: "100vw",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "contain",
        backdropFilter: "blur(8px)"
      }} />
    </div>
  );
}

function MatrixYoutube() {
  return (
    <div className="video-background" style={{
      position: "relative",
      overflow: "hidden",
      width: "100vw",
      height: "100vh"
    }}>
      <iframe style={{
          position: "relative",
          width: "250vw",
          height: "200vh",
          top: "-40%",
          left: "-50%"
      }} src="https://www.youtube.com/embed/_Lo6Vup6khc?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1&hd=1&quality=high&vq=1080" height="1080" frameBorder="0" allowFullScreen></iframe>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000)

    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, []);

  return (
    <p className="is-size-1 has-text-weight-bold">
      {time.toLocaleString()}
    </p>
  );
}

function MagicMirrorPage(props) {
  const siteTitle = props.data.site.siteMetadata.title;
  const title = `Magic Mirror | ${siteTitle}`;

  const firstSection = useRef();
  const secondSection = useRef();
  const thirdSection = useRef();

  const [section, setSection] = useState(0);

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

  const windowSize = useWindowSize();

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <html className="force-portrait-orientation" lang="en-US"/>
      </Helmet>
      <section ref={firstSection} className="hero is-danger is-fullheight">
        <div className="hero-body">
          <Clock />
        </div>
      </section>
      <section ref={secondSection} className="hero is-black is-fullheight">
        <div className="hero-body" style={{padding: 0}}>
          <ArchillectFetch />
        </div>
      </section>
      <section ref={thirdSection} className="hero is-white is-fullheight">
        <div className="hero-body" style={{padding: 0}}>
            <MatrixYoutube />
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
