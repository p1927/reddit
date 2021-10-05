import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {selectSubjectRequest, selectSubjectResponse} from "../store/selectors/selectors";
import {RedditState, SubjectSearchRequest, SubjectSearchResponse} from "../store/models/model";
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
import {changePageSize, searchSubject} from "../store/actions/actions";
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
    isLoading: false,
  };
  searchResponse: SubjectSearchResponse | any;
  postList: Post[] = [];
  pageSizeOptions: number[] = [5, 10, 25];
  currentPageSize: number = DEFAULT_LIMIT;
  index: PageIndex = {last: '', first: ''};
  isNextDisabled: boolean = false;
  isPreviousDisabled: boolean = false;

  constructor(private store: Store<RedditState>,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.store.pipe(select(selectSubjectRequest)).subscribe((subjectSearchRequest)=>{
      this.searchRequest = subjectSearchRequest;
      this.currentPageSize = this.searchRequest.limit || DEFAULT_LIMIT;
    });
    this.subscription = this.store.pipe(select(selectSubjectResponse))
      .subscribe(( subjectSearchResponse) => {
          this.searchResponse = subjectSearchResponse;
          const responseAfter = this.searchResponse.data?.after;
          const responseChildren = this.searchResponse.data?.children;
        console.log(responseAfter, responseChildren?.map((e: any) => e.data.id));
        const totalElements = this.searchResponse?.data?.dist;

        this.isPreviousDisabled = false;
        this.isNextDisabled = false;
        if (!this.searchRequest?.before && (totalElements === 0)) {
          this.snackBar.open(LAST_PAGE_REACHED, 'OK', {duration: SNACKBAR_TIMEOUT});
          this.isNextDisabled = true;
        }
        if (this.searchRequest?.before && (totalElements === 0)) {
          this.snackBar.open(FIRST_PAGE_REACHED, 'OK', {duration: SNACKBAR_TIMEOUT});
          this.isPreviousDisabled = true;
        }
        if (!this.searchRequest?.after && !this.searchRequest?.before && !(this.searchResponse?.data?.after)) {
          this.isPreviousDisabled = true;  this.isNextDisabled = true;
        }

        if (totalElements >0 ) {
          console.log('Fired');
          this.postList = this.mapResponseChildrenToPostList();
          while(this.postList.length > this.currentPageSize) {
            this.postList.pop();
          }
          console.log(this.postList.map((e) => e.id));
          this.index.last = this.getIndexFromChild(this.postList[this.postList.length - 1]);
          this.index.first = this.getIndexFromChild(this.postList[0]);
          console.log('Index', this.index);
        }

      });

  }

  mapResponseChildrenToPostList(): Post[] {
    const responseChildren = this.searchResponse.data?.children;
    let pinnnedElementsCount = this.searchResponse.data?.dist - this.currentPageSize;
      return responseChildren.map((entry: any, index: number) => {
        if((this.searchRequest.before || this.searchRequest.after) &&  (pinnnedElementsCount > 0)){
            pinnnedElementsCount--;
            return null;
        }
       else {
        return {
          kind: entry.kind,
          id: entry.data.id,
          selfText: entry.data.selfText,
          author: entry.data.author,
          created: entry.data.created,
          num_comments: entry.data.num_comments,
          score: entry.data.score,
          thumbnail: entry.data.thumbnail,
          title: entry.data.title,
        } as Post;
      }

    }).filter((element: any,index : number) => (element !== null) );
  }


  setCurrentPageSize(event: MatSelectChange): void {
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
      const searchRequest: SubjectSearchRequest = {
        subject: this.searchRequest.subject,
        limit: this.currentPageSize,
        after: this.index.last||undefined
      }
      if(searchRequest.after) {this.store.dispatch(searchSubject(searchRequest))}
  }

  fetchPreviousPosts(): void {
      const searchRequest: SubjectSearchRequest = {
        subject: this.searchRequest.subject,
        limit: this.currentPageSize,
        before: this.index.first||undefined
      }
      if(searchRequest.before) {this.store.dispatch(searchSubject(searchRequest))}

  }

  getIndexFromChild(child : any){
    return child.kind+ '_' + child.id;
  }


}
