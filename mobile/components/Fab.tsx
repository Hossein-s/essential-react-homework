import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#6200ee',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Fab({ children, onPress, style }: Props) {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      {children}
    </Pressable>
  );
}
