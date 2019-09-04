import React from 'react';
import { Redirect } from 'react-router-dom';
import { requestAuthenticateSession } from '../../services/authentication';

interface State {
    userId: string,
    redirectToLogin: boolean
}

class HomePage extends React.Component<null, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            userId: "",
            redirectToLogin: false
        }

        this.authenticateUser();
    }

    render() {
        const { redirectToLogin } = this.state

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }
        return (
            <div>
                <h1>Welcome to the ToDoApp</h1>
            </div>
        )
    }

    //Check for valid user token and retrieve user data from token
    authenticateUser = () => {
        requestAuthenticateSession(sessionStorage.getItem('todoAppToken') || '')
            .then(res => {
                if(res.data.data.returnToLogin) {
                    sessionStorage.removeItem('todoAppToken')
                    this.setState({
                        redirectToLogin: true
                    })
                }
                console.log(res)
            })
            .catch(err => console.error(err))
    }
}

export default HomePage;