export * from "./firebase";
export const response = {
  error: (message: string, status: number = 500) =>
    Response.json(message, { status }),
  success: <T>(data: T, status: number = 200) =>
    Response.json(data, { status }),
};
