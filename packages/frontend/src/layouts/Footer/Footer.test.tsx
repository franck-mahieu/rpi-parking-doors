import { Footer } from './Footer';
import React from 'react';
import renderer from 'react-test-renderer';

describe('Footer.tsx', () => {
  describe('Footer', () => {
    it('should renders correctly', async () => {
      const component = renderer.create(<Footer />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
