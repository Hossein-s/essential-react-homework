import { fireEvent, render, screen } from '@testing-library/react-native';
import { SearchInput } from '../../components/SearchInput';

describe('SearchInput', () => {
  it('renders the current value and calls onChangeText', () => {
    const onChangeText = jest.fn();

    render(<SearchInput value="mega" onChangeText={onChangeText} />);

    const input = screen.getByLabelText('Search');
    expect(input.props.value).toBe('mega');

    fireEvent.changeText(input, 'power');
    expect(onChangeText).toHaveBeenCalledWith('power');
  });

  it('supports a custom placeholder', () => {
    render(
      <SearchInput
        value=""
        onChangeText={jest.fn()}
        placeholder="Find lottery"
      />,
    );

    expect(screen.getByLabelText('Find lottery')).toBeTruthy();
    expect(screen.getByPlaceholderText('Find lottery')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(
      <SearchInput value="jackpot" onChangeText={jest.fn()} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
