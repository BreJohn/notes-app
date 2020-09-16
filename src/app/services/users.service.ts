import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  public $newUser = this.socket.fromEvent("connected users");
  constructor(private socket: Socket) {}
}
