import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, LoginCredentials } from '../types';
import { StorageService } from '../services/StorageService';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        login: '',
        senha: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setCredentials({ login: '', senha: '' });
        }, [])
    );

    const handleLoginChange = (login: string) => {
        setCredentials(prev => ({ ...prev, login }));
    };

    const handlePasswordChange = (senha: string) => {
        setCredentials(prev => ({ ...prev, senha }));
    };

    const handleLogin = async () => {
        if (!credentials.login || !credentials.senha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        setIsLoading(true);

        try {
            if (credentials.login === 'admin' && credentials.senha === 'admin') {
                const adminUser = { id: 'admin', nome: 'Administrador', login: 'admin' };
                await StorageService.setCurrentUser(adminUser);
                navigation.navigate('UserList');
                return;
            }

            const users = await StorageService.getUsers();
            const user = users.find(u => u.login === credentials.login);

            if (user) {
                await StorageService.setCurrentUser(user);
                navigation.navigate('UserList');
            } else {
                Alert.alert('Erro', 'Usuário não encontrado');
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao fazer login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = () => {
        navigation.navigate('UserForm', {});
    };

    return (
        <>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Text style={styles.title}>Acesso</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.form}>
                    <Text style={styles.label}>Login</Text>
                    <TextInput
                        style={styles.input}
                        value={credentials.login}
                        onChangeText={handleLoginChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Digite seu login"
                    />

                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        value={credentials.senha}
                        onChangeText={handlePasswordChange}
                        secureTextEntry
                        placeholder="Digite sua senha"
                    />

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? 'Entrando...' : 'Entrar'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={handleRegister}
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cadastrar-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
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
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#666',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#666',
    },
});