import express from 'express';
import { verifyToken } from '../controllers/jwt/jwtAuth';
import * as NotesController from '../controllers/notes'

const router = express.Router(); 

router.get('/',verifyToken, NotesController.getNotes);

router.get('/:noteId',verifyToken, NotesController.getNote);

router.post('/',verifyToken, NotesController.createNotes);

router.patch('/:noteId', NotesController.updateNote)

router.delete('/:noteId',verifyToken, NotesController.deleteNote)


export default router;