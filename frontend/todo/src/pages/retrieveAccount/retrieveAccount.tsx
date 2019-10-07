import React from 'react';
import './retrieveAccount.css';
import { Link, Redirect } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { getInputClassAndMessage, checkEnterKey, passwordCheck } from '../../services/inputMessages'
import { requestResetPassword, requestLinkVerification, requestPutPassword } from '../../services/passwordResetRequests';

interface State {
    email: string,
    showResetSentMessage: boolean,
    returnToLogin: boolean,
    linkValue: string,
    linkValueIsValid: boolean,
    disableSendButton: boolean,
    passwordFieldHasBeenSelected: boolean,
    password: string,
    cpassword: string
}

class RetrieveAccountPage extends React.Component<RouteComponentProps<any>, State> {
    constructor(props: any) {
        super(props);

        let linkValue: string = this.getLinkValue();

        this.state = {
            email: '',
            showResetSentMessage: false,
            returnToLogin: false,
            linkValue,
            disableSendButton: false,
            passwordFieldHasBeenSelected: false,
            password: '',
            cpassword: '',
            linkValueIsValid: false
        }
    }

    componentDidMount() {
        const {linkValue} = this.state;
        if(linkValue) {
            let associatedEmailPromise: Promise<string> = this.getEmailAssociatedWithLinkValue(linkValue);
            associatedEmailPromise.then(email => {
                if(email) {
                    this.setState({
                        linkValueIsValid: true,
                        email
                    })
                }
            })
        }
    }

    render() {
        const { updateEmail, sendPasswordResetLink, updatePassword, 
            updateConfirmPassword, requestPasswordUpdate } = this;
        const { email, showResetSentMessage, returnToLogin, disableSendButton,
            passwordFieldHasBeenSelected, cpassword, password, linkValueIsValid } = this.state;

        if(returnToLogin) {
            return (
                <Redirect to={{pathname: "/login"}} />
            )
        }

        if(linkValueIsValid) {

            let passwordInputInfo = getInputClassAndMessage(passwordCheck(password, cpassword), passwordFieldHasBeenSelected);
            let enablePasswordReset: boolean = passwordInputInfo.message === "&#x2713"

            return (
                <div className="container-main">
                    <div className="login-form">
                        <div className="container-login-data">
                            <h1 className="login-header">Password Reset:</h1>
                            <div>
                                Update Information for Account: {email}
                            </div>
                            <div className="container-input">
                                <input placeholder="Password" value={password} onChange={e => updatePassword(e)} type="password"
                                onKeyPress={e => checkEnterKey(e, requestPasswordUpdate)} className={passwordInputInfo.inputFieldClass}></input>
                                <div hidden={passwordInputInfo.message?false: true} className={passwordInputInfo.messageClass}>
                                    <p className="message-text" dangerouslySetInnerHTML={{ __html: passwordInputInfo.message}}></p>
                                </div>
                            </div>
                            <div className="container-input">
                                <input placeholder="Confirm Password" value={cpassword} onChange={e => updateConfirmPassword(e)} 
                                type="password" onKeyPress={e => checkEnterKey(e, requestPasswordUpdate)} className="input-field"></input>
                            </div>
                            <button disabled={!(enablePasswordReset && !disableSendButton)} className="button-submit" onClick={() => requestPasswordUpdate()}>Update</button>
                            <div className="reset-popup" hidden={!showResetSentMessage}>
                                Password Updated Successfully!
                            </div>
                            <p>Back to <Link className="page-link" to="/login">Login!</Link></p>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="container-main">
                <div className="login-form">
                    <div className="container-login-data">
                        <h1 className="login-header">Password Reset:</h1>
                        <div className="container-input">
                            <input value={email} onChange={e => updateEmail(e)} placeholder="Email" type="text"
                            onKeyPress={e => checkEnterKey(e, sendPasswordResetLink)} className="input-field"></input>
                        </div>
                        <button disabled={disableSendButton} className="button-submit" onClick={() => sendPasswordResetLink()}>Send</button>
                        <div className="reset-popup" hidden={!showResetSentMessage}>
                            Password Reset Link Sent!
                        </div>
                        <p>Back to <Link className="page-link" to="/login">Login!</Link></p>
                    </div>
                </div>
            </div>
        )
    }

    updateEmail = (event: any) => {
        this.setState({
            email: event.target.value
        })
    }

    sendPasswordResetLink = () => {
        this.setState({
            disableSendButton: true
        })
        requestResetPassword(this.state.email)
            .then(res => {
                this.setState({
                    showResetSentMessage: true
                })
                setTimeout(() => {
                    this.setState({
                        returnToLogin: true
                    })
                },1200)
            })
            .catch(err => {
                this.setState({
                    disableSendButton: false
                })
                console.error(err);
            })
        
    }

    updatePassword = (event: any) => {
        this.setState({
            password: event.target.value,
            passwordFieldHasBeenSelected: true
        })
    }

    updateConfirmPassword = (event: any) => {
        this.setState({
            cpassword: event.target.value
        })
    }

    getLinkValue = (): string => {
        let search = this.getUrlParams();
        return search.get('link-value') || '';
    }

    getUrlParams = () => {
        if(!this.props.location.search) return new URLSearchParams();
        return new URLSearchParams(this.props.location.search);
    }

    getEmailAssociatedWithLinkValue = (linkValue: string): Promise<string> => {
        return requestLinkVerification(linkValue).then(res => {
            let email: string = res.data.data.email;
            return email;
        })
        .catch(err => {
            console.error(err);
            return '';
        })
    }

    requestPasswordUpdate = () => {
        const { password, linkValue } = this.state;
        this.setState({
            disableSendButton: true
        })
        requestPutPassword(linkValue, password)
            .then(result => {
                this.setState({
                    showResetSentMessage: true,
                })
                setTimeout(() => {
                    this.setState({
                        returnToLogin: true
                    })
                },1200)
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    disableSendButton: false
                })
            })
    }
}

export default withRouter(RetrieveAccountPage)