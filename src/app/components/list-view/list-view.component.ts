import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {
  selectErrorMessage,
  selectIsLoading,
  selectSubjectRequest,
  selectSubjectResponse
} from "../../store/selectors/selectors";
import {RedditState, SubjectSearchRequest, SubjectSearchResponse} from "../../store/models/model";
import {Subscription} from "rxjs";
import {
  DEFAULT_LIMIT,
  FIRST_PAGE_REACHED,
  LAST_PAGE_REACHED,
  PageIndex,
  Post,
  SNACKBAR_TIMEOUT
} from "./list-view.constants";
import {MatSelectChange} from "@angular/material/select";
import {changePageSize, searchSubject} from "../../store/actions/actions";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit, OnDestroy {
  subscription: Subscription | undefined;
  searchRequest: SubjectSearchRequest = {
    subject: '',
    limit: 10,
  };
  searchResponse: SubjectSearchResponse | any;
  postList: Post[] = [];
  pageSizeOptions: number[] = [5, 10, 25];
  currentPageSize: number = DEFAULT_LIMIT;
  index: PageIndex = {last: '', first: ''};
  isNextDisabled: boolean = false;
  isPreviousDisabled: boolean = false;
  message: string | null | undefined;
  isLoading: boolean = false;

  constructor(private store: Store<RedditState>,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.subscription = this.store.pipe(select(selectSubjectRequest)).subscribe((subjectSearchRequest) => {
      this.searchRequest = subjectSearchRequest;
      this.currentPageSize = this.searchRequest.limit || DEFAULT_LIMIT;
    });
    const messageSubscription = this.store.pipe(select(selectErrorMessage)).subscribe((message) => {
      this.message = message;
    });

    const isLoadingSubscription = this.store.pipe(select(selectIsLoading)).subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    const responseSubscription = this.store.pipe(select(selectSubjectResponse))
      .subscribe((subjectSearchResponse) => {
        this.searchResponse = subjectSearchResponse;
        const responseChildren = this.searchResponse.data?.children;
        const totalElements = this.searchResponse?.data?.dist;

        this.isPreviousDisabled = false;
        this.isNextDisabled = false;
        // if searching forward and total elements returned are zero then disable Next button
        if (!this.searchRequest?.before && (totalElements === 0)) {
          this.snackBar.open(LAST_PAGE_REACHED, 'OK', {duration: SNACKBAR_TIMEOUT});
          this.isNextDisabled = true;
        }
        // if searching previous and total elements returned are zero then disable Previous button
        if (this.searchRequest?.before && (totalElements === 0)) {
          this.snackBar.open(FIRST_PAGE_REACHED, 'OK', {duration: SNACKBAR_TIMEOUT});
          this.isPreviousDisabled = true;
        }
        // if its page zero of search and forward link is null then disable Next and Previous button
        if (!this.searchRequest?.after && !this.searchRequest?.before && !(this.searchResponse?.data?.after)) {
          this.isPreviousDisabled = true;
          this.isNextDisabled = true;
        }

        // if only search has returned elements change the Post list on view
        if (totalElements > 0) {
          this.postList = this.mapResponseChildrenToPostList();
          // pop elements that are more than pageSize
          while (this.postList.length > this.currentPageSize) {
            this.postList.pop();
          }
          // define first and last reference index for the Post List
          this.index.last = this.getIndexFromChild(this.postList[this.postList.length - 1]);
          this.index.first = this.getIndexFromChild(this.postList[0]);
        }

      });
    this.subscription.add(responseSubscription);
    this.subscription.add(messageSubscription);
    this.subscription.add(isLoadingSubscription);

  }

  mapResponseChildrenToPostList(): Post[] {
    const responseChildren = this.searchResponse.data?.children;
    let pinnedElementsCount = this.searchResponse.data?.dist - this.currentPageSize;
    return responseChildren.map((entry: any) => {
      // if we are moving between pages and we receive pinned elements, remove them
      if ((this.searchRequest.before || this.searchRequest.after) && (pinnedElementsCount > 0)) {
        pinnedElementsCount--;
        return null;
      } else {
        return {
          kind: entry.kind,
          id: entry.data.id,
          selfText: entry.data.selftext,
          author: entry.data.author,
          created: entry.data.created,
          num_comments: entry.data.num_comments,
          score: entry.data.score,
          thumbnail: entry.data.thumbnail,
          title: entry.data.title,
        } as Post;
      }

    }).filter((element: any, index: number) => (element !== null));
  }


  setCurrentPageSize(event: MatSelectChange): void {
    // get an element before current post List's First element
    const searchRequest: SubjectSearchRequest = {
      subject: this.searchRequest.subject,
      limit: this.currentPageSize,
      before: this.index.first || undefined
    }
    this.store.dispatch(changePageSize(searchRequest))
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchNextPosts(): void {
    // search for next set of elements after the last PostList element
    const searchRequest: SubjectSearchRequest = {
      subject: this.searchRequest.subject,
      limit: this.currentPageSize,
      after: this.index.last || undefined
    }
    if (searchRequest.after) {
      this.store.dispatch(searchSubject(searchRequest))
    }
  }

  fetchPreviousPosts(): void {
    // search for previous set of elements before the first PostList element
    const searchRequest: SubjectSearchRequest = {
      subject: this.searchRequest.subject,
      limit: this.currentPageSize,
      before: this.index.first || undefined
    }
    if (searchRequest.before) {
      this.store.dispatch(searchSubject(searchRequest))
    }

  }

  getIndexFromChild(child: any) {
    return child.kind + '_' + child.id;
  }


}
