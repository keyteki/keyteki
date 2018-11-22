import React from 'react';

class Unauthorised extends React.Component {
    render() {
        return (<div>Sorry, you are not authorised to view that page.</div>);
    }
}

Unauthorised.displayName = 'Unauthorised';

export default Unauthorised;
