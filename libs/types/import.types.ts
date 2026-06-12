export type StatusType = "idle" | "success" | "error";

export interface FileWithSize extends File {
  size: number;
}
