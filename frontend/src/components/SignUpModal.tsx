import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignupCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import TextInputField from "./folder/TextInputField";
import styleUtils from '../styles/utils.module.css';
import { useState } from "react";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";

interface SignUpModalProps {
  onDismiss: () => void;
  onSignUpSuccessful: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
  
  const [errorText, setErrorText] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupCredentials>();

  async function onSubmit(credentials: SignupCredentials) {

    try {
      const newUser = await NotesApi.signup(credentials);
      onSignUpSuccessful(newUser);

    } catch (error) {

      if (error instanceof ConflictError) {
        setErrorText(error.message);

      } else {
        alert(error);
      }

      console.error(error);
    }
  }
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>

      {errorText && 
        <Alert variant="danger">
          {errorText}
        </Alert>
      }

        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            type="text"
            placeholder="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.usename}
          />

          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.email}
          />

          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />

          <Button
          type="submit"
          disabled={isSubmitting}
          className={styleUtils.width100}
          >
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;
