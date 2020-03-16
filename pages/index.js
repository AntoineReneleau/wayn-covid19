import React, { Component } from 'react';
import styled from "styled-components";

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            firstName: "",
            familyName: "",
            email: "",
            message: "",
            number: "",
            feedbackMessage: "",
            donneePersonnelle: false,
            displayMobile: false,
            Popup1: false,
            Popup2: false,
        };
    }


    handleSubmit(event) {
        event.preventDefault();
        const rawResponse = fetch(`${process.env.API_URL}/users`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        })
            .then(info => {
                // console.log(info)
                this.setState({
                    feedbackMessage:
                        "Nous vous remercions de votre message, une personne de l'équipe prendra contact avec vous dans les meilleurs délais.",
                    firstName: "",
                    fonction: "",
                    email: "",
                    message: "",
                });
            })
            .catch(err => console.log("HandleSubmit pb", err));
    }


    updateElement(event) {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    }
    updateCheckbox(event) {
        const { checked, value } = event.target;
        this.setState({ [value]: checked });
    }
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({ displayMobile: window.innerWidth <= 760 });
    }


    render() {

        const { firstName, fonction, email, feedbackMessage } = this.state;

        return (
            <React.Fragment>
                <PageContainer>
                    <PageWrapper>
                        <Section2>
                            <ContactForm onSubmit={event => this.handleSubmit(event)}>
                                <FormRow>
                                    <ContactInput
                                        type="text"
                                        id="firstName"
                                        aria-describedby="emailHelp"
                                        value={firstName}
                                        placeholder="NOM *"
                                        onChange={event => this.updateElement(event)}
                                    />
                                    <ContactInput
                                        type="text"
                                        id="fonction"
                                        aria-describedby="emailHelp"
                                        value={fonction}
                                        placeholder="Fonction *"
                                        onChange={event => this.updateElement(event)}
                                    />
                                    <ContactInput
                                        type="text"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        value={email}
                                        placeholder="email *"
                                        onChange={event => this.updateElement(event)}
                                    />
                                </FormRow>

                                <button type="submit" className="btn btn-mail">
                                    Envoyer
                                    </button>
                                {feedbackMessage && (
                                    <h5 className="success-message">
                                        {feedbackMessage}
                                    </h5>
                                )}
                            </ContactForm>
                        </Section2>
                    </PageWrapper>
                </PageContainer>
            </React.Fragment>

        );
    }
}

export default Contact;

const PageContainer = styled.div`
width: 100vw;
`

// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------

const PageWrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const Section2 = styled.section`
width: 100%;
padding: 5%;
display: flex;
flex-direction: column;
background-color: #f2f2ed;
align-items: center;
@media (max-width: 768px){
width: 100%;
}
`

const ContactForm = styled.form`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
`

const FormRow = styled.div`
width: 100%;
display: flex;
justify-content: center;
align-items: center;
@media (max-width: 768px){
width: 100%;
flex-direction: column;
}
`

const ContactInput = styled.input`
width: 50%;
height: 50px;
border-radius: 15px;
border: solid 1px var(--dark-blue-grey);
margin: 5px;
padding-left: 15px;
::placeholder {
font-family: Averta;
font-size: 17px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1.06;
letter-spacing: normal;
color: var(--dark-blue-grey);
opacity: 0.4;
}
@media (max-width: 768px){
width: 85%;
}
`

