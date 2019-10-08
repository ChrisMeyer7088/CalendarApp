import React from 'react';
import './hamburgerMenu.css';
import { getAccountInfo } from '../../services/infoRequests';
import { Redirect, Link } from 'react-router-dom';

interface Props {
    initalState?: boolean
}

interface State {
    token: string,
    redirectToLogin: boolean,
    username: string,
    showMenu: boolean,
    menuInTransition: boolean
}

class HamburgerMenu extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        
        let defaultMenuState: boolean = true;
        if(this.props.initalState === false) defaultMenuState = false;

        this.state = {
            token: localStorage.getItem('token') || '',
            username: '',
            redirectToLogin: false,
            showMenu: defaultMenuState,
            menuInTransition: false
        }
    }

    componentDidMount() {
        this.retrieveAccountInfo();
    }

    render() {
        const { toggleMenu } = this;
        const { redirectToLogin, username, showMenu, menuInTransition } = this.state;

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }

        let menuContainerClass = "hamburger-container"
        let profilePictureClass = "profile-picture"
        let menuElementClass = "menu-element-link"
        if(menuInTransition){
                profilePictureClass = "profile-picture hide"
                menuContainerClass = "hamburger-container hide"
                menuElementClass = "menu-element-link hide"
            }

        if(showMenu || menuInTransition) {
            return (
                <div className={menuContainerClass}>
                    <div className="hamburger-button-container">
                        <div className="hamburger-button-main" onClick={() => toggleMenu()} dangerouslySetInnerHTML={{__html: "&#x2630"}}></div>
                    </div>
                    <div className="container-profilePic">
                        <img className={profilePictureClass} src={require('../../images/emptyProfilePic.png')} 
                        alt="Something went wrong"/>
                        <div className="wrapper-username">{username}</div>
                    </div>
                    <ul className="menu-list">
                        <Link className={menuElementClass} to="/home"><li className="wrapper-menu-element"><div>My Calendar</div></li></Link>
                        <Link className={menuElementClass} to="/account"><li className="wrapper-menu-element"><div>Account</div></li></Link>
                    </ul>
                </div>
            )
        }

        return (
            <div className="hamburger-button-fixed" onClick={() => toggleMenu()} dangerouslySetInnerHTML={{__html: "&#x2630"}}></div>
        )
    }

    retrieveAccountInfo = () => {
        getAccountInfo(this.state.token)
            .then(res => {
                let data = res.data.data;
                if(data.returnToLogin) {
                    this.setState({
                        redirectToLogin: true
                    })
                } else {
                    this.setState({
                        username: data.username
                    })
                }
            })
    }

    toggleMenu = () => {
        let newMenuState = !this.state.showMenu;

        //Gives the menu time to preform its transition animation
        if(!newMenuState) {
            this.setState({
                menuInTransition: true
            })
            setTimeout(() => {
                this.setState({
                    menuInTransition: false
                })
            }, 350)
        }
        this.setState({
            showMenu: newMenuState
        })
    }
}

export default HamburgerMenu;