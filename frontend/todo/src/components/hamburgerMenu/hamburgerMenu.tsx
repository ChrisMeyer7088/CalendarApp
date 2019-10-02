import React from 'react';
import './hamburgerMenu.css';

interface Props {
    
}

interface State {
    showMenu: boolean
}

class HamburgerMenu extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            showMenu: false
        }
    }

    render() {
        const { toggleMenu } = this;
        const { showMenu } = this.state;
        
        return (
            <div>
                <div className="hamburgermenu-button-main" onClick={() => toggleMenu()} dangerouslySetInnerHTML={{__html: "&#x2630"}}></div>
            </div>
        )
    }


    toggleMenu = () => {
        console.log("current div state: " )
        this.setState({
            showMenu: !this.state.showMenu
        })
    }
}

export default HamburgerMenu;