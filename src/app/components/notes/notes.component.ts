import { Component, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FilterProperties } from "src/app/interfaces/filterProperties";
import { INote } from "src/app/model/Note";
import { NotesService } from "../../services/notes.service";
import { merge, Observable, Subscription } from "rxjs";
import * as moment from "moment";
import { Store } from "@ngrx/store";

@Component({
  selector: "notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.less"],
})
export class NotesComponent {
  allNotes: MatTableDataSource<INote>;
  noteHeaders: string[];
  filterPredicate: (note: INote, filter: string) => boolean;
  @ViewChild(MatSort) sort: MatSort;
  firstTime = true;
  filter: string;
  filterProperties: FilterProperties;
  subscription = new Subscription();
  notes: Observable<{ notes: INote[] }>;
  constructor(
    private notesService: NotesService,
    private store: Store<{ notes: { notes: INote[] } }>
  ) {}
  ngOnInit() {
    this.subscription.add(
      merge(
        this.notesService.getFirstNotes(),
        this.notesService.getNewNote()
      ).subscribe((res) => {
        if (this.firstTime) {
          this.firstTime = false;
          this.allNotes = new MatTableDataSource(res.notes);
          this.noteHeaders = Object.keys(res.notes[0]);
          this.initTableSettings();
          return;
        }
        this.allNotes.data = this.allNotes.data.concat(res.notes[0]);
        this.applyFilterIfExist();
      })
    );
    this.notes = this.store.select("notes");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilterIfExist() {
    if (this.filterProperties.filter) {
      this.allNotes.filter = this.filterProperties.filter;
    }
  }
  initTableSettings() {
    this.allNotes.sortingDataAccessor = (item, property): string | number => {
      switch (property) {
        case "date":
          return moment(item.date).format();
        default:
          return item[property];
      }
    };
    this.sort.active = "date";
    this.sort.direction = "desc";
    this.allNotes.sort = this.sort;
    this.allNotes.filterPredicate = this.filterPredicate;
  }

  applyFilterProperties(filterProperties: FilterProperties) {
    this.filterProperties = filterProperties;
    this.filterPredicate = filterProperties.filterPredicate;
    if (
      filterProperties.filter === null ||
      filterProperties.filter === undefined
    ) {
      return;
    }
    this.allNotes.filter = filterProperties.filter;
  }
}
