export interface DialogState {
  isVisible: boolean;
  title: string;
  message?: string;
  content?: React.ReactNode | null;
  response: any;
  showDialog: (
    title: string,
    content?: React.ReactNode,
    message?: string
  ) => void;
  closeDialog: () => void;
  setResponse: (response: any) => void;
}
