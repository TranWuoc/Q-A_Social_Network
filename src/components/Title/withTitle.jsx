import React, { useEffect } from 'react';

const withTitle = (Component, title) => {
  return (props) => {
    useEffect(() => {
      document.title = title;
    }, []);

    return <Component {...props} />;
  };
};

export default withTitle;
