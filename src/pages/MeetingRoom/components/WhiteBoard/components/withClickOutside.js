import React, {useState, useRef, useEffect} from 'react';

export default function withClickOutside(WrappedComponent) {
  const Component = (props) => {
    const [display, setDisplay] = useState(false);

    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!ref.current.contains(event.target)) {
          setDisplay(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
    }, [ref]);

    return <WrappedComponent display={display} setDisplay={setDisplay} ref={ref} />;
  };

  return Component;
}
