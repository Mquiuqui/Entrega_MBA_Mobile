export interface User {
    id: string;
    nome: string;
    login: string;
    senha?: string;
}

export interface LoginCredentials {
    login: string;
    senha: string;
}

export type RootStackParamList = {
    Login: undefined;
    UserList: undefined;
    UserForm: { userId?: string };
};

export interface UserFormData {
    nome: string;
    login: string;
    senha?: string;
    confirmarSenha?: string;
}