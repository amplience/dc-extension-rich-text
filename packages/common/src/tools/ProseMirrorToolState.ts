export interface ProseMirrorToolState {
  name: string;
  label: string;

  displayLabel?: React.ReactElement;
  displayIcon?: React.ReactElement;

  visible: boolean;
  enabled: boolean;
  active: boolean;
}
