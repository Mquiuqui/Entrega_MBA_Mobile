import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export class StorageService {
    static async storeUsers(users: User[]): Promise<void> {
        try {
            const jsonValue = JSON.stringify(users);
            await AsyncStorage.setItem(USERS_KEY, jsonValue);
        } catch (error) {
            console.error('Erro ao salvar usuários:', error);
            throw error;
        }
    }

    static async getUsers(): Promise<User[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(USERS_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (error) {
            console.error('Erro ao recuperar usuários:', error);
            return [];
        }
    }

    static async addUser(user: Omit<User, 'id'>): Promise<User> {
        try {
            const users = await this.getUsers();
            const newUser: User = {
                ...user,
                id: Date.now().toString(),
            };
            users.push(newUser);
            await this.storeUsers(users);
            return newUser;
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            throw error;
        }
    }

    static async updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User | null> {
        try {
            const users = await this.getUsers();
            const userIndex = users.findIndex(user => user.id === userId);

            if (userIndex === -1) {
                return null;
            }

            users[userIndex] = {
                ...users[userIndex],
                ...userData,
            };

            await this.storeUsers(users);
            return users[userIndex];
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    static async deleteUser(userId: string): Promise<boolean> {
        try {
            const users = await this.getUsers();
            const filteredUsers = users.filter(user => user.id !== userId);

            if (filteredUsers.length === users.length) {
                return false;
            }

            await this.storeUsers(filteredUsers);
            return true;
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw error;
        }
    }

    static async setCurrentUser(user: User): Promise<void> {
        try {
            const jsonValue = JSON.stringify(user);
            await AsyncStorage.setItem(CURRENT_USER_KEY, jsonValue);
        } catch (error) {
            console.error('Erro ao salvar usuário atual:', error);
            throw error;
        }
    }

    static async getCurrentUser(): Promise<User | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(CURRENT_USER_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Erro ao recuperar usuário atual:', error);
            return null;
        }
    }

    static async logout(): Promise<void> {
        try {
            await AsyncStorage.removeItem(CURRENT_USER_KEY);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    }

}