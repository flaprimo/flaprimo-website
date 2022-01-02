import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

//<MatrixCanvas height={windowSize.windowHeight} width={windowSize.windowWidth} />
const MatrixCanvas = ({height, width}) => {
  const canvas = useRef();

  useEffect(() => {
    const context = canvas.current.getContext('2d');
    
    const sizeWidth = context.canvas.clientWidth;
    const sizeHeight = context.canvas.clientHeight;
  
    // Setting up the letters
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    
  
    var letters = katakana + latin + nums;
  
    letters = letters.split('');
  
    // Setting up the columns
    var fontSize = "10",
    columns = sizeWidth / fontSize;
  
    // Setting up the drops
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = 1;
    }
  
    // Setting up the draw function
    function draw1() {
      context.fillStyle = 'rgba(0, 0, 0, .1)';
      context.fillRect(0, 0, sizeWidth, sizeHeight);
      for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        context.fillStyle = '#0f0';
        context.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > sizeHeight && Math.random() > .95) {
          drops[i] = 0;
        }
      }
    }
    const animate = setInterval(draw1, 100);
    
    // const animate = setInterval(() => {
    //   draw1;
    // }, 33)

  });

  return (
    <canvas ref={canvas} height={height} width={width} />
  );
};

MatrixCanvas.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default MatrixCanvas;