import {Component, OnInit} from '@angular/core';
import {RedditState, SubjectSearchRequest} from "../store/models/model";
import {select, Store} from "@ngrx/store";
import {searchSubject} from "../store/actions/actions";
import {selectSubjectRequest} from "../store/selectors/selectors";
import {DEFAULT_LIMIT} from "../list-view/list-view.constants";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchRequest: SubjectSearchRequest | undefined;
  searchText = 'xxy';

  constructor(private store: Store<RedditState>,
  ) {
  }

  search(): void {
    console.log(this.searchText);
    this.store.dispatch(searchSubject({subject: this.searchText, limit: this.searchRequest?.limit||DEFAULT_LIMIT}));
  }

  ngOnInit(): void {
    this.store.pipe(select(selectSubjectRequest)).subscribe((searchRequest) => {
      this.searchRequest = searchRequest;
    });
  }


}
