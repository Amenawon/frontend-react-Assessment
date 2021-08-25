import React from 'react';

class Loader extends React.Component {
    render() {
        return (
            <p style={{ textAlign: 'center', fontSize: '30px' }}>
        Hold on, fetching data may take some time :)
      </p>
          );
    }    
}

export default Loader;