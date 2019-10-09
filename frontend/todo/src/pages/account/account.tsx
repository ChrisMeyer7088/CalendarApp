import React from 'react'
import './account.css';
import { Redirect } from 'react-router-dom';
import { getAccountInfo, deleteAccount } from '../../services/infoRequests';
import HamburgerMenu from '../../components/hamburgerMenu/hamburgerMenu';

interface State {
    token: string,
    redirectToLogin: boolean,
    email: string,
    username: string,
    showAccountDeletionForm: boolean
}

class Account extends React.Component<null, State> {
    private deleteFormRef = React.createRef<HTMLDivElement>();
    constructor(props: any) {
        super(props);

        this.state = {
            token: localStorage.getItem('token') || '',
            redirectToLogin: false,
            email: '',
            username: '',
            showAccountDeletionForm: false
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);     
        this.retrieveAccountInfo();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    render() {
        const { showDeletionForm, hideDeletionForm, requestAccountDeletion, deleteToken } = this;
        const {redirectToLogin, email, username, showAccountDeletionForm} = this.state;

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }

        return (
            <div className="container-content">
                <HamburgerMenu initalState={false}/>
                <div id="container-account-page">
                    <div id="container-account-form">
                        <div className="container-profileInfo">
                            <img className="account-profile-picture" src={require('../../images/emptyProfilePic.png')} 
                            alt="Something went wrong"/>
                            <div ref={this.deleteFormRef} className="account-delete-form" hidden={!showAccountDeletionForm}>
                                <div className="delete-form-text">Are you sure you want to delete your account?</div>
                                <button onClick={() => requestAccountDeletion()} className="delete-form-button red-button">YES, DELETE MY ACCOUNT</button>
                                <button onClick={() => hideDeletionForm()} className="delete-form-button green-button">NO, BACK TO SAFETY</button>
                            </div>
                            <div className="account-userInfo">Username: {username}</div>
                            <div className="account-userInfo">Email: {email}</div>
                            <div><button onClick={() => deleteToken()} className="account-logout-button">Logout</button></div>
                            <div><button onClick={() => showDeletionForm()} id="account-delete-button">Delete Account</button></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    returnToLogin = () => {
        localStorage.removeItem('token')
        this.setState({
            redirectToLogin: true
        })
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
                        username: data.username,
                        email: data.email
                    })
                }
            })
    }

    showDeletionForm = () => {
        this.setState({
            showAccountDeletionForm: true
        })
    }

    hideDeletionForm = () => {
        this.setState({
            showAccountDeletionForm: false
        })
    }

    handleClickOutside = (event: any) => {
        let node = this.deleteFormRef.current;
        if(node && !node.contains(event.target))
            this.hideDeletionForm()
    }

    requestAccountDeletion = () => {
        const { token } = this.state;
        deleteAccount(token)
        .then(res => {
            if(res.status === 200) {
                this.deleteToken();
            }
        })
        .catch(err => {
            console.error(err)
        })
    }

    deleteToken = () => {
        localStorage.clear();
        this.setState({
            redirectToLogin: true
        })
    }
}

export default Account;