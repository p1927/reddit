import {DEFAULT_LIMIT} from "../../components/list-view/list-view.constants";

export interface SubjectSearch {
  subjectSearchRequest: SubjectSearchRequest;
  subjectSearchResponse: SubjectSearchResponse;
  message: string | null;
  isLoading: boolean;
}

export interface RedditState {
  subjectSearch: SubjectSearch | any;
}


export const initialRedditState: RedditState = {
  subjectSearch: {
    subjectSearchRequest: {
      subject: '',
      limit: DEFAULT_LIMIT
    },
    subjectSearchResponse: {},
    message: null,
    isLoading: false,
  }
};

export interface SubjectSearchRequest {
  subject: string;
  limit?: number;
  before?: string;
  after?: string;
  isLoading?: boolean;
}

export interface SubjectSearchResponse {
  kind?: string;
  data?: {
    after: string | null;
    dist: number | null;
    modhash: string | null;
    geo_filter: null;
    children:
      Array<{
        "kind": string | null;
        "data": any;
      }>;
    before: string | null;
  }

}
