import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit){
    const response = await fetch(input, init);

    if (response.ok){
        return response;

    }else{

        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if(response.status === 401){
            throw new UnauthorizedError(errorMessage)

        }else if(response.status === 409){
            throw new ConflictError(errorMessage)

        }else{
            throw Error("Request failed with status: "+ response.status + " message: " + errorMessage);

        }
    }

}

export async function fetchNotes(): Promise<Note[]>{
    const token = localStorage.getItem("token");
    
    const response = await fetchData("api/notes",{
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`, 
         // "Content-Type": "application/json",
        },
      });
      return response.json();

}

// Get logged in user

export async function getLoggedInUser():Promise<User>{

    const token = localStorage.getItem("token");
    const response = await fetchData('/api/users',
    {
        method:'GET',
        headers: {
            "Authorization": `Bearer ${token}`, 
            // "Content-Type": "application/json",
        },
    });
    
    return response.json();

}

// Sign up 

export interface SignupCredentials{
    usename: string,
    email: string,
    password: string,
}

export async function signup(credentials: SignupCredentials): Promise<User> {
    const response = await fetchData('/api/users/signup',{

        method:'POST',
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(credentials),
    });

    return response.json(); 
    
}

// Log in 

 export interface LoginCredentials {
    username:string,
    password:string,
 }

 export async function login(credentials: LoginCredentials):Promise<User>{
        const response = await fetchData('/api/users/login', {
            method:'POST',
            headers: {
                "Content-Type": "application/json", 

            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        console.log(data);
    
        if (data.token) {

          localStorage.setItem("token", data.token);
          alert(`Login Successful, the user now is: ${credentials.username}`);
          console.log("--------------------");
          console.log(localStorage.getItem("token"));
        
        } else {
          alert("Please check your email and password");
        }

        return data;
     

 }

 // Logout 

 export async function logout(){

    localStorage.clear();
    
    await fetchData('/api/users/logout',{
        method:'POST',
    
    });
 }

// Create note api 

export interface NoteInput {
    title: string,
    text?: string,
}

export async function createNote(note: NoteInput): Promise<Note>{
    const token = localStorage.getItem("token");
    const response = await fetchData('api/notes',
    {
        method: 'POST',
        headers:{
            
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(note),
    });

    return response.json();

}

// Update note api

export async function updateNote(noteId: string,note:NoteInput):Promise<Note>{
    const usertoken = localStorage.getItem("token");
    const  myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${usertoken}`);
    myHeaders.append("Content-Type", "application/json");

    const response = await fetchData('api/notes/' + noteId,
    {
        method: 'PATCH',
        headers:myHeaders,
        body: JSON.stringify(note),
    });

    return response.json();

}
// Delete note api 

export async function deleteNote(noteId: string){
    const usertoken = localStorage.getItem("token");
    const  myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${usertoken}`);
    myHeaders.append("Content-Type", "application/json");

    await fetchData('api/notes/' + noteId,
    {
        method: 'DELETE',
        headers:myHeaders,

    });
}