import { render, screen } from '@testing-library/react';
import ReactHookForm from './react-hook-form';

test('renders learn react link', () => {
  render(<ReactHookForm />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
