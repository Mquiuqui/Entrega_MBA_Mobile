import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, UserFormData, User } from '../types';
import { StorageService } from '../services/StorageService';

type UserFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserForm'>;
type UserFormScreenRouteProp = RouteProp<RootStackParamList, 'UserForm'>;

interface Props {
    navigation: UserFormScreenNavigationProp;
    route: UserFormScreenRouteProp;
}

export const UserFormScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { userId } = route.params;
    const isEditing = !!userId;

    const [formData, setFormData] = useState<UserFormData>({
        nome: '',
        login: '',
        senha: '',
        confirmarSenha: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            loadUserData();
        }
    }, [userId]);

    const loadUserData = async () => {
        try {
            const users = await StorageService.getUsers();
            const user = users.find(u => u.id === userId);
            if (user) {
                setFormData({
                    nome: user.nome,
                    login: user.login,
                    senha: '',
                });
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao carregar dados do usuário');
        }
    };

    const handleNameChange = (nome: string) => {
        setFormData(prev => ({ ...prev, nome }));
    };

    const handleLoginChange = (login: string) => {
        setFormData(prev => ({ ...prev, login }));
    };

    const handlePasswordChange = (senha: string) => {
        setFormData(prev => ({ ...prev, senha }));
    };
    const handleConfirmPasswordChange = (confirmarSenha: string) => {
        setFormData(prev => ({ ...prev, confirmarSenha }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (isEditing) {
                if (formData.senha || formData.confirmarSenha) {
                    if (!formData.senha || !formData.confirmarSenha) {
                        Alert.alert('Erro', 'Preencha senha e confirmar senha');
                        setIsLoading(false);
                        return;
                    }
                    if (formData.senha !== formData.confirmarSenha) {
                        Alert.alert('Erro', 'As senhas não são iguais');
                        setIsLoading(false);
                        return;
                    }
                }

                const updateData: Partial<Omit<User, 'id'>> = {
                    nome: formData.nome,
                    login: formData.login,
                };
                if (formData.senha) {
                    updateData.senha = formData.senha;
                }

                await StorageService.updateUser(userId!, updateData);
                Alert.alert('Sucesso', 'Usuário atualizado com sucesso', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                const users = await StorageService.getUsers();
                const loginExists = users.some(u => u.login === formData.login);

                if (loginExists) {
                    Alert.alert('Erro', 'Este login já está cadastrado');
                    return;
                }

                if (!formData.senha || !formData.confirmarSenha) {
                    Alert.alert('Erro', 'Senha e confirmar senha são obrigatórias');
                    setIsLoading(false);
                    return;
                }
                if (formData.senha !== formData.confirmarSenha) {
                    Alert.alert('Erro', 'As senhas não são iguais');
                    setIsLoading(false);
                    return;
                }

                await StorageService.addUser({
                    nome: formData.nome,
                    login: formData.login,
                    senha: formData.senha,
                });

                Alert.alert('Sucesso', 'Usuário cadastrado com sucesso', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar usuário');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Voltar">
                        <MaterialIcons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {isEditing ? 'Editar Usuário' : 'Cadastrar Usuário'}
                    </Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o nome completo"
                        value={formData.nome}
                        onChangeText={handleNameChange}
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Login *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o Login"
                        value={formData.login}
                        onChangeText={handleLoginChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={styles.label}>Senha {isEditing ? '' : '*'} </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={isEditing ? 'Digite a nova senha (opcional)' : 'Digite a senha'}
                        value={formData.senha}
                        onChangeText={handlePasswordChange}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Confirmar Senha {isEditing ? '' : '*'} </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={isEditing ? 'Confirme a nova senha (opcional)' : 'Digite novamente a senha'}
                        value={formData.confirmarSenha}
                        onChangeText={handleConfirmPasswordChange}
                        secureTextEntry
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? 'Salvando...' : 'Salvar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        padding: 20,
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        gap: 15,
    },
    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#666',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    cancelButtonText: {
        color: '#666',
    },
});