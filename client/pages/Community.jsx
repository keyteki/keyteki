import React from 'react';
import Panel from '../Components/Site/Panel';

class Community extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <Panel title='The Crucible Online - Community Information'>
                    <h3>What is this page?</h3>
                    <p>This page is a shoutout to other works/resources in the KeyForge community.</p>

                    <h3>KeyForge Discord</h3>
                    <p>Link: <a href='https://discordapp.com/invite/PcTGhr9' target='_blank'>Keyforge Discord</a></p>
                    <p>Discord is a text and voice communicaton application. Created by members of the Keyforge community, it's a robust community of LCG/CCG/RPG players.</p>

                    <h3>UNDER CONSTRUCTION</h3>
                </Panel>
            </div>
        );
    }
}

Community.displayName = 'Community';
Community.propTypes = {
};

export default Community;
