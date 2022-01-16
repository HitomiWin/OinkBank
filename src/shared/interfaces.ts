import { FieldValue } from "firebase/firestore";
export interface Child {
  created: FieldValue;
  isPaused: boolean;
  isWeekly: boolean;
  lastDate: string;
  name: string;
  nextDate: string;
  parent: string;
  price: number;
  total: number;
}

export interface ChildQuery {
  error: boolean | null;
  isError: boolean | null;
  isLoading: boolean | undefined;
  isSuccess: boolean | null;
  addChild: (childInfo: Child) => Promise<void>;
}
