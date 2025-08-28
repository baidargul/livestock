export interface DialogState {
  isVisible: boolean;
  title: string;
  message?: string;
  content?: React.ReactNode | null;
  response: any;
  layer: string;
  secondLayer: string;
  showDialog: (
    title: string,
    content?: React.ReactNode,
    message?: string
  ) => void;
  closeDialog: () => void;
  setResponse: (response: any) => void;
  setLayer: (layer: string) => void;
  setSecondLayer: (layer: string) => void;
}
