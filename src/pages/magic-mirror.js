import React, { useState, useEffect, useRef } from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import MatrixCanvas from "../components/MatrixCanvas";

// const draw = context => {
//   var sizeWidth = context.canvas.clientWidth;
//   var sizeHeight = context.canvas.clientHeight;

//   // Setting up the letters
//   const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
//   const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const nums = '0123456789';
  

//   var letters = katakana + latin + nums;

//   letters = letters.split('');
//   //letters = letters.split('');

//   // Setting up the columns
//   var fontSize = 16,
//   columns = sizeWidth / fontSize;

//   // Setting up the drops
//   var drops = [];
//   for (var i = 0; i < columns; i++) {
//     drops[i] = 1;
//   }

//   // Setting up the draw function
//   function draw1() {
//     context.fillStyle = 'rgba(0, 0, 0, .1)';
//     context.fillRect(0, 0, sizeWidth, sizeHeight);
//     for (var i = 0; i < drops.length; i++) {
//       var text = letters[Math.floor(Math.random() * letters.length)];
//       context.fillStyle = '#0f0';
//       context.fillText(text, i * fontSize, drops[i] * fontSize);
//       drops[i]++;
//       if (drops[i] * fontSize > sizeHeight && Math.random() > .95) {
//         drops[i] = 0;
//       }
//     }
//   }

//   // Loop the animation
//   setInterval(draw1, 33);
// };

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
            <MatrixCanvas height={window.innerHeight} width={window.innerWidth} />
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
