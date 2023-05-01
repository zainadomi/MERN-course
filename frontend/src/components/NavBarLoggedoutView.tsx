import { Button } from "react-bootstrap";
import { User } from "../models/user";

interface  NavBarLoggedoutViewProps{
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedoutView = ({onSignUpClicked,onLoginClicked}:NavBarLoggedoutViewProps) => {
    return ( 
      <>
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLoginClicked}>Log In</Button>

     </>

     );
}
 
export default NavBarLoggedoutView;