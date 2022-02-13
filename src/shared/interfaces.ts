import { FieldValue } from "firebase/firestore";
export interface Child {
  id: string;
  created: FieldValue;
  isPaused: boolean;
  isWeekly: boolean;
  lastDate: string;
  name: string;
  parent: string;
  price: number;
}

export interface ChildQuery {
  error: boolean | null;
  isError: boolean | null;
  isLoading: boolean | undefined;
  isSuccess: boolean | null;
  addChild: (childInfo: Child) => Promise<void>;
}

export interface Transaction {
  id: string;
  created: FieldValue;
  paymentDate: string;
  price: number;
  isRegular: boolean;
}
