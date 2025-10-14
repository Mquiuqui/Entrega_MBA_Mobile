import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { User } from '../types';

type Props = {
  item: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string, userName: string) => void;
};

export const ItemComponent: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onEdit(item.id)}
      onLongPress={() => onDelete(item.id, item.nome)}
    >
      <View style={styles.itemTextBox}>
        <Text style={styles.itemTitle}>{item.nome}</Text>
        <Text style={styles.itemSubtitle}>{item.login}</Text>
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTextBox: {
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  chevron: {
    fontSize: 18,
    color: '#999',
  },
});