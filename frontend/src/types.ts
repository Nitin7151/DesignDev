export enum StepType {
  CreateFile = "CreateFile",
  UpdateFile = "UpdateFile",
  DeleteFile = "DeleteFile",
  RunCommand = "RunCommand"
}

export interface Step {
  type: StepType;
  path?: string;
  code?: string;
  command?: string;
  status: "pending" | "completed" | "error";
  description?: string;
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileItem[];
}
