import React, { useState, useEffect, useRef } from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import cheerio from 'cheerio';
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

function MeteoFetch() {
  const [currentMeteo, setCurrentMeteo] = useState([]);
  const baseUrl = 'https://thingproxy.freeboard.io/fetch/https://www.3bmeteo.com/meteo/roma'

  const getCurrentMeteo = async() => {
    try {
      const responsePromise = await fetch(baseUrl);
      const response = await responsePromise.text();
      const $ = cheerio.load(response); 
      const currentMeteo = $('.navDays:nth-child(2) img').attr('alt');
      console.log(currentMeteo);

      return currentMeteo;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchMeteoAPI() {
      const currentMeteo = await getCurrentMeteo();
      setCurrentMeteo(currentMeteo);
    }

    const grabMeteoTimer = setInterval(() => {
      fetchMeteoAPI();
    }, 1000 * 3600);

    return () => {
      clearInterval(grabMeteoTimer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, [currentMeteo]);

  return (
    <p>{currentMeteo}</p>
  );
}

function ArchillectFetch() {
  const [imageUrl, setImageUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/2/25/Odd-eyed_Turkish_Angora_cat_-_20080830.jpg');
  const baseUrl = 'https://archillect.fla-primo-engineer.workers.dev/?https://archillect.com/'

  const getArchiveMaxPostId = async() => {
    try {
      const responsePromise = await fetch(baseUrl.concat('archive'), {
        mode: 'cors',
        headers: {
          'Content-Type': 'text/html'
        }
      });
      const response = await responsePromise.text();
      const $ = cheerio.load(response); 
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
        const responsePromise = await fetch(baseUrl.concat(postId), {
          mode: 'cors',
          headers: {
            'Content-Type': 'text/html'
          }
        });
        const response = await responsePromise.text();
        const $ = cheerio.load(response); 
        const imageUrl = $('#ii').attr('src');
        console.log(imageUrl);
        
        return imageUrl;
      } catch (error) {
        console.error(error);
      }
    } else {
      return 'https://upload.wikimedia.org/wikipedia/commons/2/25/Odd-eyed_Turkish_Angora_cat_-_20080830.jpg';
    }
  }

  useEffect(() => {
    async function fetchArchillectAPI() {
      const imageUrl = await getArchiveRandomImage();
      setImageUrl(imageUrl);
    }

    const grabImageTimer = setInterval(() => {
      fetchArchillectAPI();
    }, 120000);

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
      transition: "all 1s ease-in-out",
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
        transition: "all 1s ease-in-out",
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
      {time.toLocaleString("it-IT", {timeZone: "Europe/Rome"})}
    </p>
  );
}

function MagicMirrorPage() {
  const firstSection = useRef();
  const secondSection = useRef();

  const [section, setSection] = useState(0);

  useEffect(() => {
    console.log(section, '- Has changed')

    if (section === 0)
      firstSection.current.scrollIntoView({ behavior: 'smooth' });
    else if (section === 1)
      secondSection.current.scrollIntoView({ behavior: 'smooth' });
  }, [section]) // <-- here put the parameter to listen

  useEffect(() => {
    const sectionTimer = setInterval(() => {
      setSection((section + 1) % 2);
    }, 5000);

    return () => {
      clearInterval(sectionTimer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, [section]);

  const windowSize = useWindowSize();

  return (
    <div>
      <section ref={firstSection} className="hero is-fullheight is-black" >
        <div className="hero-body">
          <Clock />
        </div>
      </section>
      <section ref={secondSection} className="hero is-black is-fullheight">
        <div className="hero-body" style={{padding: 0}}>
          <ArchillectFetch />
        </div>
      </section>
    </div>
  );
}

export const Head = ({ data }) => (
  <title>Magic Mirror | {data.site.siteMetadata.title}</title>
)

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
