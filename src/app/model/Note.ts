export interface INote {
  title: string;
  body: string;
  userName: string;
  date: number;
}

export interface INotesResponse {
  notes: INote[];
}
