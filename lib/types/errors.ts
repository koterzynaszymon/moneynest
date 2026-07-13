export type ErrorResponse = {
    success: false;
    message: string;
} | {
    success: true;
    data: undefined;
}