import type { Lottery } from '../../types';

export function lottery(
  id: string,
  overrides: Partial<Lottery> = {},
): Lottery {
  return {
    id,
    name: `Lottery ${id}`,
    prize: 'Prize',
    type: 'simple',
    status: 'running',
    ...overrides,
  };
}
