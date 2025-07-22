export interface LoaderState {
  loading: boolean;
  text: string;
  setLoading: (loading: boolean, text?: string) => void;
}
