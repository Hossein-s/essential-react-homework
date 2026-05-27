import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Fab } from '../../components/Fab';

describe('Fab', () => {
  it('exposes accessibility props and handles press', () => {
    const onPress = jest.fn();

    render(
      <Fab accessibilityLabel="Add lottery" onPress={onPress}>
        <Text>+</Text>
      </Fab>,
    );

    const button = screen.getByRole('button', { name: 'Add lottery' });
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
