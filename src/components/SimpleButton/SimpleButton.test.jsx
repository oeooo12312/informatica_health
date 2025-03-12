import { render, screen, fireEvent } from '@testing-library/react';
import SimpleButton from './SimpleButton';


test('calls "Hello world" when button is clicked', () => {
    const mockHandler = jest.fn();
    console.log = jest.fn(); // Mock the console.log method
  
    render(<SimpleButton onClick={mockHandler} label="Click me" />);
  
    // Simulate the button click
    fireEvent.click(screen.getByText('Click me'));
  
    // Assert "Hello world" was logged
    expect(console.log).toHaveBeenCalledWith('Hello world!');
    
    // Ensure the mockHandler function was called
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });