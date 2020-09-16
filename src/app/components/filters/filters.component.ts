import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { INote } from "src/app/model/Note";
import * as moment from "moment";
import { FilterProperties } from "src/app/interfaces/filterProperties";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { FilteringOptions } from "src/app/enums/FilteringOptions";

@Component({
  selector: "filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.less"],
})
export class FiltersComponent {
  @Input() notes: MatTableDataSource<INote>;
  @Output() onFilterChange = new EventEmitter<FilterProperties>();
  filterForm: FormGroup;
  filterProperties: FilterProperties;
  userNameOptions = FilteringOptions;
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      title: [null, null],
      body: [null, null],
      userNameOptions: [FilteringOptions._Contains, null],
      userName: [null, null],
      from: [null, null],
      to: [null, null],
      lastHour: [null, null],
      noteType: [null, null],
    });
  }

  ngOnInit() {
    this.filterProperties = {
      ...this.filterProperties,
      filterPredicate: this.createFilterPredicate(),
    };
    this.onFilterChange.emit(this.filterProperties);
    this.setSubscriptions();
  }

  setSubscriptions() {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.filterChanged();
      });
    this.filterForm.get("lastHour").valueChanges.subscribe((value) => {
      if (!value) {
        this.filterForm.enable({ emitEvent: false });
        return;
      }
      this.filterForm.get("from").reset("", { emitEvent: false });
      this.filterForm.get("to").reset("", { emitEvent: false });
      this.filterForm.get("from").disable({ emitEvent: false });
      this.filterForm.get("to").disable({ emitEvent: false });
    });
  }

  filterChanged() {
    this.filterProperties = {
      ...this.filterProperties,
      filter: this.createFilters(),
    };
    this.onFilterChange.emit(this.filterProperties);
  }

  createFilterPredicate() {
    const filterPredicate = (note: INote, filter: string) => {
      const filterObj = JSON.parse(filter);
      const result = Object.keys(filterObj).reduce((prev, curr) => {
        return prev && this.filterByKey(note, curr);
      }, true);
      return result;
    };
    return filterPredicate;
  }

  filterByKey(note: INote, key: string) {
    const filterValue = this.filterForm.get(key).value;

    switch (key) {
      case "from": {
        const transformedFilter = moment(filterValue).startOf("day").format();
        const transformedInput = moment(note.date).startOf("day").format();
        return moment(transformedFilter).isSameOrBefore(transformedInput);
      }
      case "to": {
        const transformedFilter = moment(filterValue).startOf("day").format();
        const transformedInput = moment(note.date).startOf("day").format();
        return moment(transformedFilter).isSameOrAfter(transformedInput);
      }
      case "lastHour": {
        const lastHour = moment().subtract(60, "m").format();
        const transformedInput = moment(note.date).format();
        return moment(lastHour).isSameOrBefore(transformedInput);
      }
      case "noteType": {
        return note.userName === "system note";
      }
      case "userName":
      case "userNameOptions": {
        if (this.filterForm.get("userName").value) {
          const userName = this.filterForm.get("userName").value.toLowerCase();
          if (
            this.filterForm.get("userNameOptions").value ===
            FilteringOptions._Contains
          )
            return note?.userName.toLowerCase().indexOf(userName) !== -1;
          else if (
            this.filterForm.get("userNameOptions").value ===
            FilteringOptions._ExactMatch
          )
            return note["userName"].toLowerCase() === userName;
          return note["userName"].toLowerCase().startsWith(userName);
        }
        break;
      }
      default: {
        return note[key].toLowerCase().indexOf(filterValue) !== -1;
      }
    }
  }

  createFilters() {
    const appliedFilters = Object.keys(this.filterForm.controls).filter(
      (key) => {
        return (
          this.filterForm.controls[key].value !== null &&
          this.filterForm.controls[key].value !== "" &&
          this.filterForm.controls[key].value !== false
        );
      }
    );
    let filterObj = {};
    appliedFilters.forEach((filter) => {
      filterObj = { ...filterObj, [filter]: this.filterForm.get(filter).value };
    });
    return JSON.stringify(filterObj);
  }
}
