export interface Document {
    type: string;
    title: string;
    position: number;
}

export type ApiResponse<T> = {
    data?: T;
    error?: string;
};
