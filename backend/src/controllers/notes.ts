import { NextFunction, RequestHandler, Response, text } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { UserRequest } from "../../types";
import NoteModel from '../models/note'
import { assertIsDefined } from "../util/assertIsDefined";


// Get all notes
export const getNotes: any = async (req:UserRequest,res:Response,next:NextFunction) =>{

    const authenticatedUserId = req.userId;

    try{
        
       // assertIsDefined(authenticatedUserId);
        assertIsDefined(authenticatedUserId);
        const notes = await NoteModel.find({userId:authenticatedUserId}).exec();
        res.status(200).json(notes);
    }catch(error){
        next(error )
     
    }
}

// Get single note

export const getNote: any = async (req:UserRequest,res:Response,next:NextFunction) => {

    const noteId = req.params.noteId;
    const authenticatedUserId = req.userId;


    try{

        assertIsDefined(authenticatedUserId);
         
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,'Invalid note id');
        }
        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,'Note not found');
        }

        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You can't access this note")
        }

        res.status(200).json(note);
    }catch(error){
        next(error )
     
    }
};
//Create note

export const createNotes:any = async (req:UserRequest,res:Response,next:NextFunction) => {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.userId; // what should I put instead of this

    try{

        assertIsDefined(authenticatedUserId);

        if(!title){
            throw createHttpError(400, 'Note must have a title')
        }
        
        const newNote = await NoteModel.create({
                userId:authenticatedUserId,
                title:title,
                text:text,
        });

        res.status(201).json(newNote); 

    }catch(error){
        next(error);
    }
}

// Update note  

interface UpdateNoteParams{
    noteId: string,
}

interface UpdateNoteBody{
    title?: string,
    text?: string,
}

export const updateNote:any=async (req:UserRequest,res:Response,next:NextFunction) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.userId;

    
    try{

        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,'Invalid note id');
        }

        if(!newTitle){
            throw createHttpError(400, 'Note must have a title')
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,'Note not found');
        }

        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You can't access this note")
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote)
    }catch(error){
        next(error)

    }
    
}

// Delete note

export const deleteNote: any = async (req:UserRequest,res:Response,next:NextFunction) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.userId;


    try{

        assertIsDefined(authenticatedUserId)
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,'Invalid note id');
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,'Note not found');
        }

        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You can't access this note")
        }

        await note.deleteOne();
        // NoteModel.findByIdAndDelete(note);
        res.sendStatus(204);
        
    }catch(error){
        next(error)
    }
    
}