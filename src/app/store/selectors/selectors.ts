import {RedditState, SubjectSearch} from "../models/model";
import {createSelector} from "@ngrx/store";


export const SubjectSearchSelector = (state: RedditState) => state.subjectSearch;

export const selectSubjectRequest = createSelector(
  SubjectSearchSelector,
  (state : SubjectSearch) => state.subjectSearchRequest
);

export const selectSubjectResponse = createSelector(
  SubjectSearchSelector,
  (state : SubjectSearch) => state.subjectSearchResponse
);




export const selectErrorMessage = createSelector(
  SubjectSearchSelector,
  (state : SubjectSearch) => state.message
);
