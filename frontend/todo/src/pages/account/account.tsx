import React from 'react'
import './account.css';
import { Redirect } from 'react-router-dom';
import { getAccountInfo } from '../../services/infoRequests';
import HamburgerMenu from '../../components/hamburgerMenu/hamburgerMenu';

interface State {
    token: string,
    redirectToLogin: boolean,
    email: string,
    username: string
}

class Account extends React.Component<null, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            token: localStorage.getItem('token') || '',
            redirectToLogin: false,
            email: '',
            username: ''
        }
    }

    componentDidMount() {
        this.retrieveAccountInfo();
    }
    
    render() {
        const {} = this;
        const {redirectToLogin} = this.state;

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }

        return (
            <div className="container-content">
                <HamburgerMenu initalState={false}/>
                <div id="container-account-page">
                    <div id="container-account-form">
                        <div>
                            
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
}

export default Account;