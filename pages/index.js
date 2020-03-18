import React, { Component } from 'react';
import styled from "styled-components";
import { Checkbox } from 'antd';

const Job = [
    'Anesthésiste-réanimateur exerçant en réanimation médicale',
    'Cardiologue/pneumologue en USIC',
    'Autre spécialité exerçant en USC',
    'Cardiologue (exerçant en service conventionnel)',
    'Pneumologue (exerçant en service conventionnel)',
    'Infectiologue',
    'Médecin généraliste',
    'Autre spécialité en service conventionnel ou ambulatoire'
]


class mainPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            skills: {},
            roleSelection: -1,
            skillsSelection: [],
            location: "",
            requestProcessed: false,
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
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(response => {
                this.setState({
                    data: response.body.humanRessources,
                    skills: response.body.skills
                });
            })
            .catch(err => console.log("Problem in fetching data from API", err));
    }

    resize() {
        this.setState({ displayMobile: window.innerWidth <= 760 });
    }

    updateRole(event, index) {
        event.preventDefault();
        const dataKeys = Object.keys(this.state.data);
        const selectedKey = dataKeys[index]
        const skills = this.state.data[selectedKey]
        const skillsBool = new Array(skills.length).fill(false)
        this.setState({
            data: this.state.data,
            roleSelection: index,
            skillsSelection: skillsBool,
            location: this.state.location,
            requestProcessed: this.state.requestProcessed,
            listOfSuggestions: this.state.listOfSuggestions
        })
    }

    updateSkills(skills, index) {
        event.preventDefault();

        skills[index] = !skills[index]
        this.setState({
            skillsSelection: skills,
            ...this.state
        })
    }

    updateElement(event) {
        event.preventDefault();

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
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(response => {
                this.setState({
                    requestProcessed: true,
                    listOfSuggestions: response.body
                });
            })
            .catch(err => console.log("Problem in processing request", err));
    }

    render() {

        const { data, skills, location, roleSelection, skillsSelection } = this.state;
        const roles = Object.keys(data);
        const skills_keys = Object.keys(skills);

        return (
            <PageContainer>
                <PageWrapper>
                    <TitleContainer>
                        <HeroTitle>WAYN-COVID19: Where Am I Needed.</HeroTitle>
                    </TitleContainer>
                    <SplashText>Application de mise en contact des professionnels de santé disponibles pour aider à l’effort sanitaire dans le cadre de l’épidémie de Covid-19</SplashText>

                    <Section1>
                        <ContactForm onSubmit={event => this.handleSubmit(event)}>
                            <ContactFormWrapper>
                                <ChoiceContainer>
                                    <BoxChoice border={this.state.Profession == 'Médical'} onClick={() => this.setState({ Profession: 'Médical' })} >Je suis <br /> professionnel médical</BoxChoice>
                                    <BoxChoice border={this.state.Profession == 'Paramédical'} onClick={() => this.setState({ Profession: 'Paramédical' })}>Je suis <br /> professionnel paramédical</BoxChoice>
                                    <BoxChoice border={this.state.Profession == 'Autre'} onClick={() => this.setState({ Profession: 'Autre' })} >Je suis <br /> professionnel autre</BoxChoice>
                                </ChoiceContainer>

                                {/* <Label>Vous êtes ici en tant que:</Label>
                                {roles.map((value, index) => {
                                    return <CheckboxContanier key={index}>
                                        <Checkbox
                                            name="branch1"
                                            checked={roleSelection == index}
                                            onChange={e => this.updateRole(e, index)}
                                        />
                                        <CheckboxLabel>{value}</CheckboxLabel>
                                    </CheckboxContanier>
                                })} */}


                                {/* <Label>Vous êtes capables de:</Label>
                                {(roleSelection >= 0) &&
                                    data[roles[roleSelection]].map((value, index) => {
                                        return <CheckboxContanier key={index}>
                                            <Checkbox
                                                name="branch2"
                                                checked={skillsSelection[index]}
                                                onChange={e => this.updateSkills(skillsSelection, index)}
                                            />
                                            <CheckboxLabel>{value}</CheckboxLabel>
                                        </CheckboxContanier>
                                    })} */}

                                <Displayer style={{ display: this.state.Profession == 'Médical' ? 'block' : 'none' }} >


                                    <Label>Mes compétences</Label>
                                    {skills_keys.map((value, index) => {
                                        return <div key={index}>
                                            <SecondaryLabel>{value}</SecondaryLabel>
                                            {skills[value].map((value2, index2) => {
                                                return <CheckboxContanier key={index2}>
                                                    <Checkbox
                                                        name="branch2"
                                                        checked={skillsSelection[index]}
                                                        onChange={e => this.updateSkills(skillsSelection, index)}
                                                    />
                                                    <CheckboxLabel>{value2}</CheckboxLabel>
                                                </CheckboxContanier>
                                            })
                                            }
                                        </div>
                                    })}
                                </Displayer>
                                <Displayer style={{ display: this.state.Profession == 'Médical' ? 'block' : 'none' }}>

                                    <Label>Position approximative:</Label>
                                    <ContactInput
                                        type="text"
                                        id="location"
                                        aria-describedby="locationHelp"
                                        value={this.state.location}
                                        placeholder="Code postal *"
                                        onChange={event => this.updateElement(event)}
                                    />
                                </Displayer>



                                <button style={{ display: this.state.Profession == 'Médical' ? 'block' : 'none' }} type="submit" className="btn btn-mail">
                                    Où devrais-je me rendre?
                                    </button>
                                {this.state.requestProcessed && (
                                    this.state.listOfSuggestions.length == 0 ?
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
                                        this.state.listOfSuggestions.map((value, index) => {
                                            return JSON.stringify(value)
                                        })
                                )}


                            </ContactFormWrapper>
                        </ContactForm>
                    </Section1>
                </PageWrapper>
            </PageContainer>
        );
    }
}

export default mainPage;

const PageContainer = styled.div`
width: 100vw;
margin-bottom: 50px;
`
const PageWrapper = styled.div`
margin-top: 150px;
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`
// ---------------------------------------------------
// ---------------------------------------------------


const TitleContainer = styled.div`
width: 100vw;
height: 100px;
z-index: 3;
position: fixed;
top: 0;
display: flex;
justify-content: center;
align-items: center;
background-color: var(--bleu-officiel);
`

const HeroTitle = styled.h3`
width: 80%;
margin: 20px;
color: white;
`

const SplashText = styled.h5`
width: 80%;
color: black;
text-align: center;
`


// ---------------------------------------------------
// ---------------------------------------------------

const Section1 = styled.section`
width: 100%;
margin-top: 50px;
display: flex;
flex-direction: column;
align-items: center;
@media (max-width: 768px){
width: 100%;
}
`

// ---------------------------------------------------
// ---------------------------------------------------

const ContactForm = styled.form`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
`

const ContactFormWrapper = styled.div`
width: 60%;
display: flex;
flex-direction: column;
`

// ---------------------------------------------------
// ---------------------------------------------------

const ChoiceContainer = styled.div`
display: flex;
justify-content: space-evenly;
margin-bottom: 30px;
`

const BoxChoice = styled.div`
width: 220px;
height: 220px;
border: 3px solid var(--bleu-officiel);
color: ${props => props.border ? "white" : "black"};
background-color:  ${props => props.border ? "var(--bleu-officiel)" : "white"};
display: flex;
justify-content: center;
align-items: center;
cursor: pointer;
text-align: center;
font-family: 'Roboto', sans-serif;
font-size: 17px;
font-weight: normal;
font-style: normal;
font-stretch: normal;
line-height: 1.29;
letter-spacing: normal;
`

// ---------------------------------------------------
// ---------------------------------------------------

const Displayer = styled.div`
width: 100%;
border: 2px solid var(--bleu-officiel);
padding: 40px;
border-radius: 10px;
margin-top: 30px;
`

// ---------------------------------------------------
// ---------------------------------------------------

const Label = styled.h3`
text-align: left;
margin: 15px 0;
color: black;
font-weight: bold;
`

const SecondaryLabel = styled.h3`
text-align: left;
font-family: Averta-Bold;
font-size: 17px;
font-weight: normal;
font-style: normal;
font-stretch: normal;
line-height: 1.29;
letter-spacing: normal;
margin: 10px 0;
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
const CheckboxLabel = styled.label`
font-family: 'Roboto', sans-serif;
font-size: 17px;
font-weight: normal;
font-style: normal;
font-stretch: normal;
line-height: 1.29;
letter-spacing: normal;
margin-left: 10px;
`
const CheckboxContanier = styled.div`
display: flex;
margin: 5px;
background-color: #f2f6fa;
`
