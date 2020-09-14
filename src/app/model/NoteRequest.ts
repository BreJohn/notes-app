interface INoteRequest {
  title: string;
  body: string;
  userName: string;
}

export class NoteRequest {
  title: string;
  body: string;
  userName: string;

  constructor({ title, body, userName }: INoteRequest) {
    Object.assign(this, { title, body, userName });
  }
}
