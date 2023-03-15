
export type AuthProvider = 'Basic' | 'Google' | 'FaceBook' | 'Pending' | 'None';
export type withMsg<T> = [T, string?]
export interface UserState {
    authProvider: AuthProvider;
    userId?: string;
    roomId?: string;
};
