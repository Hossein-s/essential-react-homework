import { StyleSheet, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderRadius: 8,
  },
});

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search',
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}
