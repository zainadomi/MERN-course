import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavBarLoggedoutView from "./NavBarLoggedoutView";
import NavBarLoggedInView from "./NavBarLoggedInView";
import { Link } from "react-router-dom";

interface NavBarProps{

    loggedInUser: User | null,
    onSignUpClicked: ()=> void,
    onLoginClicked: ()=> void,
    onLogoutSuccesful : ()=> void,

}

const NavBar  = ({loggedInUser,onSignUpClicked,onLoginClicked,onLogoutSuccesful}: NavBarProps) => {
    return (  
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Cool Notes App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link as={Link}  to='/privacy'>
                            Privacy  
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">   
                        {loggedInUser
                        ? <NavBarLoggedInView  user={loggedInUser} onLoggedoutSuccessful={onLogoutSuccesful}/>
                        : <NavBarLoggedoutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked} />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}
 
export default NavBar ;