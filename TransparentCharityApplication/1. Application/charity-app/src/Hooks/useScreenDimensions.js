import { useState, useEffect } from 'react';

// get screen dimentions and return width and height
function getScreenDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}


export default function useScreenDimensions() {
  // useState variables to refresh components  
  const [screenDimensions, setScreenDimensions] = useState(getScreenDimensions());

    // get, change and return stored screensize
  useEffect(() => {
    function handleResize() {
		setScreenDimensions(getScreenDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return screenDimensions;
}
