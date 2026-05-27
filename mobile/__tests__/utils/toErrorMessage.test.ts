import { toErrorMessage } from '../../utils/toErrorMessage';

describe('toErrorMessage', () => {
  it('returns message from Error', () => {
    expect(toErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('returns fallback for non-Error values', () => {
    expect(toErrorMessage('nope')).toBe('Something went wrong');
  });
});
