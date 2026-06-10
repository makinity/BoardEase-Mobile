import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type SearchInputProps = TextInputProps & { value: string; onChangeText: (text: string) => void };

export function SearchInput({ onChangeText, style, value, ...props }: SearchInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
        clearButtonMode="while-editing"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, paddingVertical: 8 },
  input: {
    backgroundColor: '#F0F0F3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#000',
  },
});
