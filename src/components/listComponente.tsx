import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { User } from '../types';
import { ItemComponent } from './itemComponent';

type Props = {
  users: User[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string, userName: string) => void;
};

export const ListComponente: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return (
      <View>
        <Text style={{ padding: 16, color: '#666' }}>Nenhum usuário cadastrado</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemComponent item={item} onEdit={onEdit} onDelete={onDelete} />
      )}
    />
  );
};