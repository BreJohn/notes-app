import { Action } from "@ngrx/store";
import { INote } from "src/app/model/Note";

export const GET_NOTES = "GET_NOTES";

export class GetNotes implements Action {
  readonly type = GET_NOTES;
  payload: INote[];
}
