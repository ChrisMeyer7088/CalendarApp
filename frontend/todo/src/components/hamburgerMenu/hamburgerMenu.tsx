import React from 'react';
import './hamburgerMenu.css';

interface Props {
    showMenu: boolean
}

class HamburgerMenu extends React.Component<Props> {

    render() {
        const { showMenu } = this.props;

        let containerClass = "hamburger-container hide"
        if(showMenu) containerClass = "hamburger-container"

        return (
            <div className={containerClass}>
                <img className="profile-picture" src={require('../../images/emptyProfilePic.png')} 
                alt="Something went wrong"/>
            </div>
        )
    }
}

export default HamburgerMenu;