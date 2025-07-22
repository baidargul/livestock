export interface DialogState {
  isVisible: boolean;
  title: string;
  content: React.ReactNode | null;
  response: any;
  showDialog: (title: string, content: React.ReactNode) => void;
  closeDialog: () => void;
  setResponse: (response: any) => void;
}
