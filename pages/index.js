import React, { Component } from 'react';
import styled from "styled-components";
import { Checkbox } from 'antd';

class mainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visitorType: "",
            //
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
        if (typeof window !== 'undefined'){
            const script = document.createElement("script");
     
            script.src   = "https://static.airtable.com/js/embed/embed_snippet_v1.js";
            script.async = true;
            
            document.body.appendChild(script);    
        }
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

                let skills = response.body.skills
                let skillsSelection = {}
                for (let key in skills) {
                    let value = skills[key]
                    skillsSelection[key] = new Array(value.length).fill(false)
                }
                this.setState({
                    data: response.body.humanRessources,
                    jobs: response.body.jobs,
                    skills: skills,
                    skillsSelection: skillsSelection, 
                });
            })
            .catch(err => console.log("Problem in fetching data from API", err));
    }

    resize() {
        this.setState({ displayMobile: window.innerWidth <= 760 });
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

        const { data, jobs, skills, location, roleSelection, skillsSelection } = this.state;
        const roles = Object.keys(data);
        const skills_keys = Object.keys(skills);

        return (
            <PageContainer>
                <PageWrapper>
                    <TitleContainer>
                        <HeroTitle>COVID19: Où a-t-on besoin de médecins?</HeroTitle>
                    </TitleContainer>
                    <SplashText>Confronté à l'épidémie du COVID-19, le corps médical français doit se coordonner pour mieux faire face et gérer l'effort dans la durée.</SplashText>

                    <Section0>
                        <ChoiceContainer>
                            <BoxChoice0
                                border={this.state.visitorType == 'Médical'}
                                onClick={() => this.setState({ visitorType: 'Médical' })}>
                                    Je suis professionnel médical, <br /> 
                                    volontaire à une garde.
                            </BoxChoice0>
                            <BoxChoice0
                                border={this.state.visitorType == 'Référent'}
                                onClick={() => this.setState({ visitorType: 'Référent' })}>
                                    Je suis chef de service ou référent d'un service hospitalier. <br /> 
                                    Nous sommes sous pression et nous avons besoin de professionnels volontaires.
                            </BoxChoice0>

                            {this.state.displayMobile && this.state.Profession == 'Médical' && <Image src="/static/images/down.png" alt="down" />}
                        </ChoiceContainer>                        
                    </Section0>

                    <Section1 style={{ display: this.state.visitorType == 'Référent' ? 'block' : 'none' }}>
                        <Displayer >
                            <Label>Contactez les volontaires proches de vous sur 
                                <a href='https://airtable.com/universe/exp5fcFCp8McPcfNB/corps-medical-recensement-de-volontaires'> ce lien-ci.</a>
                            </Label>
                        </Displayer>
                    </Section1>

                    <Section1 style={{ display: this.state.visitorType == 'Médical' ? 'block' : 'none' }}>
                        <Displayer>
                        <iframe src="https://airtable.com/embed/shr96cS9bBW60fEgc?backgroundColor=red"
                                style={{className:    "airtable-embed airtable-dynamic-height",
                                        frameboder:   "0",
                                        background:   "transparent",
                                        border:       "1px solid #ccc",
                                        onmousewheel: "",
                                        width:        "100%",
                                        height:       "100%"
                                    }}>
                        </iframe>
                        </Displayer>
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
width: 60%;
margin: 20px;
color: white;

`

const SplashText = styled.h5`
width: 60%;
//color: #0b6ba8;
color: black;
text-align: center;
@media (max-width: 768px){
    font-size: 20px;
}
`

// ---------------------------------------------------
// ---------------------------------------------------

const Section0 = styled.section`
width: 100%;
margin-top: 50px;
display: flex;
flex-direction: column;
align-items: center;
@media (max-width: 768px){
width: 100%;
margin-top: 20px;
}
`

const BoxChoice0 = styled.div`
width: 480px;
height: 240px;
padding: 10px;
border: 3px solid var(--bleu-officiel);
color: ${props => props.border ? "white" : "var(--bleu-officiel)"};
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
@media (max-width: 768px){
height: 100px;
width: 95%;
margin-bottom: 10px;
}
`

// ---------------------------------------------------
// ---------------------------------------------------

const Section1 = styled.section`
width: 60%;
margin-top: 50px;
display: flex;
flex-direction: column;
align-items: center;
@media (max-width: 768px){
width: 100%;
margin-top: 20px;
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
@media (max-width: 768px){
width: 100%;
padding: 10px;
}
`

// ---------------------------------------------------
// ---------------------------------------------------

const ChoiceContainer = styled.div`
display: flex;
justify-content: space-evenly;
margin-bottom: 30px;
@media (max-width: 768px){
    width: 100%;
    flex-direction: column;
    align-items: center;
margin: 0px;

}
`

const BoxChoice = styled.div`
width: 240px;
height: 240px;
padding: 10px;
border: 3px solid var(--bleu-officiel);
color: ${props => props.border ? "white" : "var(--bleu-officiel)"};
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
@media (max-width: 768px){
height: 100px;
width: 95%;
margin-bottom: 10px;
}
`

const Image = styled.img`
width: 50px;
color: var(--bleu-officiel);
`

// ---------------------------------------------------
// ---------------------------------------------------

const Displayer = styled.div`
width: 100%;
border: 2px solid #ccc;
padding: 40px;
background-color: #f2f6faad;
border-radius: 5px;
margin-top: 30px;
@media (max-width: 768px){
padding: 10px;
}
`

// ---------------------------------------------------
// ---------------------------------------------------

const Block = styled.div`
border: 1px solid #ccc;
padding: 20px;
margin-bottom: 20px;
background-color: white;
`


const Label = styled.h3`
text-align: left;
margin: 15px 0 30px;
color: #0b6ba8;
font-weight: bold;
`

const SecondaryLabel = styled.h3`
text-align: left;
font-size: 17px;
font-weight: 600;
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
`
