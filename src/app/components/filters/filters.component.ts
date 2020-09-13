import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Note } from "src/app/model/Note";
import * as moment from "moment";
import { FilterProperties } from "src/app/interfaces/filterProperties";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { merge } from "rxjs";

@Component({
  selector: "filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.less"],
})
export class FiltersComponent {
  @Input() notes: MatTableDataSource<Note>;
  @Output() onFilterChange = new EventEmitter<FilterProperties>();
  filterForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      title: [null, null],
      body: [null, null],
      userName: [null, null],
      from: [null, null],
      to: [null, null],
      lastHour: [null, null],
    });
  }

  ngOnInit() {
    this.setSubscriptions();
  }

  setSubscriptions() {
    this.filterForm.valueChanges.subscribe( _ => {
      this.filterChanged();
    });
    this.filterForm.get('lastHour').valueChanges.subscribe(
      (value) => {
        if(!value) {
          this.filterForm.enable();
          return;
        }
        this.filterForm.get('from').reset('', {emitEvent: false})
        this.filterForm.get('to').reset('', {emitEvent: false})
        this.filterForm.get('from').disable({emitEvent: false});
        this.filterForm.get('to').disable({emitEvent: false});
      }
    )
  }

  filterChanged() {
    const filterPredicate = this.createFilterPredicate();
    const filter = this.createFilters();
    this.onFilterChange.emit({ filter, filterPredicate });
  }

  createFilterPredicate() {
    const filterPredicate = (note: Note, filter: string) => {
      const filterObj = JSON.parse(filter);
      const result = Object.keys(filterObj).reduce(
        (prev, curr) => {

          return prev && this.filterByKey(note, curr, filterObj);
        }, true
      )
      return result;
    };
    return filterPredicate;
  }

  filterByKey(note: Note, key: string, filterObj: any) {
    const filterValue = this.filterForm.get(key).value;

    switch (key) {
          case "from": {
            if (filterValue === "invalid date") {
              return true;
            }
            if (!moment(note.date).isValid()) {
              return false;
            }
            const transformedFilter = moment(filterValue).startOf("day").format();
            const transformedInput = moment(note.date).startOf("day").format();
            return moment(transformedFilter).isSameOrBefore(transformedInput);
          }
          case "to": {
            if (filterValue === "invalid date") {
              return true;
            }
            if (!moment(note.date).isValid()) {
              return false;
            }
            const transformedFilter = moment(filterValue).startOf("day").format();
            const transformedInput = moment(note.date).startOf("day").format();
            return moment(transformedFilter).isSameOrAfter(transformedInput);
          }
          case "lastHour": {
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
          this.filterForm.controls[key].value !== '')
      }
    )
    let filterObj = {}
    appliedFilters.forEach(
      (filter) => {
        filterObj = {...filterObj, [filter]: this.filterForm.get(filter).value}
      }
    )
    return JSON.stringify(filterObj);
  }

}
