import { useState ,useEffect} from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddEditNoteDialog from "./AddEditNoteDialog";
import { Note as NoteModel } from "../models/note";
import * as NotesApi from "../network/notes_api";
import styleUtils from "../styles/utils.module.css";
import styles from "../styles/NotePage.module.css";
import Note from "./Note";





const NotesPageLoggedinView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [notesLodading, setNotesLoading] = useState(true);
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);


  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const notesGrid = 
  <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
  {notes.map((note) => (
    <Col key={note._id}>
      <Note
        note={note}
        className={styles.note}
        onNoteClicked={setNoteToEdit}
        onDeleteNoteClicked={deleteNote}
      />
    </Col>
  ))}
</Row>
    
    return ( 

        <>
        <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}
      >
        <FaPlus />
        Add new note
      </Button>
      {notesLodading && <Spinner  animation='border' variant='primary' />}
      {showNotesLoadingError &&  <p>Something went wrong. Please refresh the page.</p>}
      {!notesLodading && !showNotesLoadingError && 
      <>
        {
          notes.length > 0 
          ? notesGrid
          :<p>You dont't have any notes yet</p>
        }
      </>
      }
      {showAddNoteDialog && (
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updateNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updateNote._id ? updateNote : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
      
        </>
     );
}
 
export default NotesPageLoggedinView;