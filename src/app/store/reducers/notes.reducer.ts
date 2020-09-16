import { INote } from "../../model/Note";
import * as NoteActions from "../actions/notes.actions";

export function notesReducer(
  state: INote[] = [],
  action: NoteActions.GetNotes
) {
  switch (action.type) {
    case NoteActions.GET_NOTES: {
      return state;
    }
  }
}
