import { INote } from "../model/Note";

export interface FilterProperties {
  filter: string;
  filterPredicate: (note: INote, filter: string) => boolean;
}
