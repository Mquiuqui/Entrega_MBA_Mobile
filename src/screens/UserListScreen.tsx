import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, User } from '../types';
import { StorageService } from '../services/StorageService';
import { ListComponente } from '../components/listComponente';

type UserListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserList'>;

interface Props {
    navigation: UserListScreenNavigationProp;
}

export const UserListScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const userList = await StorageService.getUsers();
            setUsers(userList);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao carregar usuários');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadUsers();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
    };

    const handleEditUser = (userId: string) => {
        navigation.navigate('UserForm', { userId });
    };

    const handleDeleteUser = (userId: string, userName: string) => {
        Alert.alert(
            'Confirmar exclusão',
            `Deseja realmente excluir o usuário ${userName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await StorageService.deleteUser(userId);
                            await loadUsers();
                            Alert.alert('Sucesso', 'Usuário excluído com sucesso');
                        } catch (error) {
                            Alert.alert('Erro', 'Falha ao excluir usuário');
                        }
                    },
                },
            ]
        );
    };

    const handleAddUser = () => {
        navigation.navigate('UserForm', {});
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Deseja realmente sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    onPress: async () => {
                        await StorageService.logout();
                        navigation.navigate('Login');
                    },
                },
            ]
        );
    };


    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Text style={styles.title}>Usuários</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerIconBtn} onPress={handleAddUser} accessibilityLabel="Novo cadastro">
                        <MaterialIcons name="person-add" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconBtn} onPress={handleLogout} accessibilityLabel="Sair">
                        <MaterialIcons name="logout" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <ListComponente
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconBtn: {
        marginLeft: 12,
        padding: 6,
    },
});