
import { HashRouter as Router } from 'react-router-dom'
import './App.css'
import { darkTheme , lightTheme } from './utils/Themes'
import Contact from './Components/Contact/Contact'
import Error from './Components/Error'
import Skills from './Components/Skills'
import Navbar from './Components/Navbar'
import styled, { ThemeProvider } from 'styled-components'
import { useState } from 'react'
import Hero from './Components/HeroSection'
import Education from './Components/Education'
import Experience from './Components/Experience'
import Projects from './Components/Projects'
import Footer from './Components/Projects/Footer/footer'

const Body = styled.div`
    background-color : ${({theme }) => theme.bg};
    width : 100%;
    overflow-x : hidden; 
    `
const Wrapper = styled.div`
    background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
    width: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 100%,30% 98%, 0 100%);
  `    
function App() {

  const [darkMode, setDarkMode] = useState(true);
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  console.log(openModal)

  return (
    
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
    <Router>

    <Navbar/>
    
    <Body>
      <Hero/>
      <Wrapper>
      <Skills/>
      <Experience/>
      
      </Wrapper>
      <Projects/>
      <Wrapper>
        <Education/>
        <Contact/>
      </Wrapper>
      <Footer/>
    </Body>
    </Router>
    </ThemeProvider>
  )
}

export default App
