import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  const mock = new Proxy(actual, {
    get: (target, prop) => {
      // Return a simple div-based mock for any icon component
      return (props) => <div data-testid={`mock-icon-${String(prop)}`} {...props} />;
    },
  });
  return {
    ...mock,
    // Keep some specific exports if needed, otherwise default proxy handles all
  };
});


expect.extend(matchers);

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});
