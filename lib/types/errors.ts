export type Response = {
    success: false;
    message: string;
} | {
    success: true;
    data: unknown;
}