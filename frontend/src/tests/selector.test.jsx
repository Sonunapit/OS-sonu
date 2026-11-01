import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

function mockMatchMedia(mobile) {
  window.matchMedia = vi.fn().mockImplementation((q) => ({ matches: mobile, media: q, addEventListener() {}, removeEventListener() {} }));
}

describe('OS selector', () => {
  it('shows Windows, macOS and Linux on desktop', async () => {
    mockMatchMedia(false);
    const { default: OSSelector } = await import('../os/selector/OSSelector.jsx');
    render(<OSSelector />);
    expect(screen.getByRole('radio', { name: /windows/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /macos/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /linux/i })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: /iphone/i })).toBeNull();
  });
});
