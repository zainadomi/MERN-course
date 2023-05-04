import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LogInModal from "./components/LogInModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import NotesPage from "./pages/NotesPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/privacyPage";
import styles from './styles/App.module.css'

// shift + alt + o ==> Remove all unused imports

function App() {

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModel, setShowSignUpModel] = useState(false);
  const [showLoginModel, setShowLoginUpModel] = useState(false);

  const fetchLoggedInUser = async ()=> {

    try {
      const user = await NotesApi.getLoggedInUser();
      setLoggedInUser(user);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>

      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => {
            setShowLoginUpModel(true);
          }}
          onLogoutSuccesful={() => {
            setLoggedInUser(null);
          }}
          onSignUpClicked={() => {
            setShowSignUpModel(true);
          }}
        />

        <Container className={styles.pageContainer}>
          <Routes>
            <Route
              path="/"
              element={<NotesPage loggedInUser={loggedInUser} />}
            />

            <Route path="/privacy" element={<PrivacyPage />} />

            <Route
              path="/*"
              element={<NotFoundPage  />}
            />
          </Routes>
        </Container>

        {showSignUpModel && (
          <SignUpModal
            onDismiss={() => {
              setShowSignUpModel(false);
            }}
            onSignUpSuccessful={(user) => {
              setLoggedInUser(user);
              setShowLoginUpModel(false);
            }}
          />
        )}

        {showLoginModel && (
          <LogInModal
            onDismiss={() => {
              setShowLoginUpModel(false);
            }}
            onLoginSuccsessful={(user) => {
              setLoggedInUser(user);
              setShowLoginUpModel(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
