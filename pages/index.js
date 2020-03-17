import React, { Component } from 'react';
import styled from "styled-components";

class mainPage extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            data  :            {},
            skills:            {},
            roleSelection:     -1,
            skillsSelection:   [],
            location:          "",
            requestProcessed:  false,
            listOfSuggestions: [],
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        //
        //Fetching ressources data from API
        const rawResponse = fetch(`${process.env.API_URL}/ressources`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(r =>  r.json().then(data => ({status: r.status, body: data})))
            .then(response => {
                this.setState({
                    data  : response.body.humanRessources,
                    skills: response.body.skills
                });
            })
            .catch(err => console.log("Problem in fetching data from API", err));
    }

    resize() {
        this.setState({ displayMobile: window.innerWidth <= 760 });
    }

    updateRole(event, index){
        const dataKeys    = Object.keys(this.state.data);
        const selectedKey = dataKeys[index]
        const skills      = this.state.data[selectedKey]
        const skillsBool  = new Array( skills.length ).fill(false)

        this.setState({
            data:              this.state.data,
            roleSelection:     index,
            skillsSelection:   skillsBool,
            location:          this.state.location,
            requestProcessed:  this.state.requestProcessed,
            listOfSuggestions: this.state.listOfSuggestions
        })

    }

    updateSkills(skills, index){
        skills[index] = !skills[index]
        this.setState({
            skillsSelection: skills,
            ...this.state
        })
    }

    updateElement(event) {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const rawResponse = fetch(`${process.env.API_URL}/whereto`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        })
            .then(r =>  r.json().then(data => ({status: r.status, body: data})))
            .then(response => {
                this.setState({
                    requestProcessed : true,
                    listOfSuggestions: response.body
                });
            })
            .catch(err => console.log("Problem in processing request", err));
    }

    render() {

        const { data, skills, location, roleSelection, skillsSelection } = this.state;
        const roles       = Object.keys(data);
        const skills_keys = Object.keys(skills);

        return (
            <React.Fragment>
                <PageContainer>
                    <PageWrapper>
                        <Section2>

                            <HeroTitle>WAYN-COVID19: Where Am I Needed.</HeroTitle>

                            <SplashText>Cette application a pour objectif de coordonner l'effort médical contre le COVID19 sur tout le territoire français. Si vous êtes secouriste, interne ou médecin spécialisé, nous vous indiquons où vos compétences peuvent être utiles.</SplashText>

                            <ContactForm onSubmit={event => this.handleSubmit(event)}>

                                <FormRow>
                                    <Label>Vous êtes ici en tant que:</Label>
                                    {roles.map( (value, index) => {
                                        return <div key={index}>
                                            <input
                                                type="radio"
                                                name="branch1"
                                                checked={roleSelection==index}
                                                onChange={ e=> this.updateRole(e, index) }
                                            />
                                            <label>{value}</label>
                                            </div>
                                    })}

                                    <Label>Vous êtes capables de:</Label>
                                    {(roleSelection>=0) &&
                                      data[roles[roleSelection]].map( (value, index) => {
                                        return <div key={index}>
                                            <input
                                                type="checkbox"
                                                name="branch2"
                                                checked={skillsSelection[index]}
                                                onChange={ e=> this.updateSkills(skillsSelection, index) }
                                            />
                                            <label>{value}</label>
                                            </div>
                                    })}

                                    <Label>Plus précisément:</Label>
                                    {skills_keys.map( (value, index) => {
                                        return <div key={index}>
                                            <label>{value}</label>
                                            {skills[value].map( (value2, index2)=> {
                                                return <div key={index2}>
                                                    <input
                                                        type="checkbox"
                                                        name="branch2"
                                                        checked={skillsSelection[index]}
                                                        onChange={ e=> this.updateSkills(skillsSelection, index) }
                                                    />
                                                    <label>{value2}</label>
                                                </div>
                                            })
                                            }
                                            </div>
                                    })}

                                    <Label>Position approximative:</Label>

                                    <ContactInput
                                        type="text"
                                        id="location"
                                        aria-describedby="locationHelp"
                                        value={this.state.location}
                                        placeholder="Adresse *"
                                        onChange={event => this.updateElement(event)}
                                    />
                                </FormRow>

                                <button type="submit" className="btn btn-mail">
                                    Où devrais-je me rendre?
                                    </button>
                                {this.state.requestProcessed && (
                                    this.state.listOfSuggestions.length==0 ? 
                                    // Either no suggestion found
                                    <div>
                                    <h5 className="success-message">
                                    Désolé. Nous ne référençons aucune demande en urgence qui requiert votre attention.
                                    </h5>
                                    <h5 className="success-message">
                                    Vous pouvez remplir le formulaire de recensement.
                                    </h5>
                                    </div>
                                    :
                                    // Or use a mapping of the list found
                                    this.state.listOfSuggestions.map( (value, index) => {
                                        return JSON.stringify(value)
                                    })
                                )}
                            </ContactForm>
                        </Section2>
                    </PageWrapper>
                </PageContainer>
            </React.Fragment>

        );
    }
}

export default mainPage;

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

const HeroTitle = styled.div`
width: 50%;
height: 50px;
margin: 5px;
padding-left: 15px;
padding-bottom: 40px;

font-family: Baskerville;
font-size: 30px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1.06;
letter-spacing: normal;
color: var(--dark-blue-grey);
opacity: 1.0;
@media (max-width: 768px){
width: 85%;
}
`

const SplashText = styled.div`
width: 50%;
height: 50px;
margin: 5px;
padding-left: 15px;
padding-bottom: 40px;

font-family: Baskerville;
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1.06;
letter-spacing: normal;
color: var(--dark-blue-grey);
opacity: 1.0;
@media (max-width: 768px){
width: 85%;
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
flex-direction: column;
justify-content: center;
align-items: center;
padding-bottom: 50px;
@media (max-width: 768px){
width: 100%;
flex-direction: column;
}
`

const Label = styled.div`
width: 50%;
padding-left: 15px;
padding-top : 15px;

font-family: Averta;
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1.06;
letter-spacing: normal;
color: var(--dark-blue-grey);
opacity: 0.8;
@media (max-width: 768px){
width: 85%;
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

