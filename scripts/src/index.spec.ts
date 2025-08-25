import { getNumberOnTheScreenByClassName } from './index';

describe('getNumberOnTheScreenByClassName', () => {
  it('rejects when element not found', async () => {
    await expect(
      getNumberOnTheScreenByClassName('not-exist', 0)
    ).rejects.toThrow('Element with class not-exist not found');
  });

  it('retries to find element and resolves when found', async () => {
    jest.useFakeTimers();

    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'appears-later';
      div.textContent = '42';
      document.body.appendChild(div);
    }, 0);

    const promise = getNumberOnTheScreenByClassName('appears-later', 1, 0);

    jest.runAllTimers();
    await expect(promise).resolves.toBe(42);

    jest.useRealTimers();
  });
});
