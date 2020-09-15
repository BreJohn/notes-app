import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IUser } from "src/app/model/User";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.less"],
})
export class UsersComponent implements OnInit {
  userHeaders: any;
  constructor(private usersService: UsersService) {}

  userSub = new Subscription();
  users: IUser[];

  ngOnInit(): void {
    this.userSub.add(
      this.usersService.$newUser.subscribe((res: any) => {
        this.userHeaders = Object.keys(res.users[0]);
        this.users = res.users;
      })
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
