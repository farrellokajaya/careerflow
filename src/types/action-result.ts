export type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
