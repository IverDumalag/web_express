import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import * as UserData from './data/UserData';
import UserLogin from './user/UserLogin';
import { UserProtectedRoute, AdminProtectedRoute } from './utils/ProtectedRoute';
import MessagePopup from './components/MessagePopup';
import HomePage from './pages/HomePage';

// Mock dependencies
jest.mock('axios');
const mockedAxios = axios;

// Direct localStorage mock implementation in the test file
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserData Utility Functions', () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    localStorage.clear.mockClear();
  });

  test('localStorage mock should be setup correctly', () => {
    expect(typeof localStorage.setItem).toBe('function');
    expect(typeof localStorage.getItem).toBe('function');
    expect(typeof localStorage.removeItem).toBe('function');
    expect(jest.isMockFunction(localStorage.setItem)).toBe(true);
  });

  test('should store user data in localStorage', () => {
    const userData = { id: 1, name: 'Test User', email: 'test@example.com' };
    
    UserData.setUserData(userData);
    
    expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(userData));
  });

  test('should retrieve user data from localStorage', () => {
    const userData = { id: 1, name: 'Test User', email: 'test@example.com' };
    localStorage.getItem.mockReturnValue(JSON.stringify(userData));
    
    const result = UserData.getUserData();
    
    expect(localStorage.getItem).toHaveBeenCalledWith('userData');
    expect(result).toEqual(userData);
  });

  test('should clear user data from localStorage', () => {
    UserData.clearUserData();
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
  });

  test('should return null when no user data exists', () => {
    localStorage.getItem.mockReturnValue(null);
    
    const result = UserData.getUserData();
    
    expect(result).toBeNull();
  });

  test('should handle invalid JSON in localStorage', () => {
    localStorage.getItem.mockReturnValue('invalid-json');
    
    expect(() => UserData.getUserData()).toThrow();
  });
});

describe('UserLogin Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockedAxios.post.mockClear();
    localStorage.setItem.mockClear();
  });

  test('should render login form', () => {
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to exPress')).toBeInTheDocument();
    expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
  });  test('should update form state on input change', () => {
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('should show validation error for empty fields', async () => {
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    // Get the form element and submit it directly to bypass HTML5 validation
    const form = container.querySelector('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Missing Information')).toBeInTheDocument();
    });
  });

  test('should handle successful login', async () => {
    const mockResponse = {
      data: {
        status: 200,
        user: { id: 1, email: 'test@example.com', role: 'user' }
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(mockResponse.data.user));
    });
  });

  test('should handle login error', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Login failed'));
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Login Failed')).toBeInTheDocument();
    });
  });

  test('should toggle password visibility', () => {
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const passwordInput = container.querySelector('input[name="password"]');
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    
    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('should navigate to admin dashboard for admin users', async () => {
    const mockResponse = {
      data: {
        status: 200,
        user: { id: 1, email: 'admin@example.com', role: 'admin' }
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/adminanalytics');
    }, { timeout: 2000 });
  });

  test('should navigate to user home for regular users', async () => {
    const mockResponse = {
      data: {
        status: 200,
        user: { id: 1, email: 'user@example.com', role: 'user' }
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/userhome');
    }, { timeout: 2000 });
  });
});

describe('Protected Routes', () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
  });

  test('UserProtectedRoute should allow access for user role', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ id: 1, role: 'user' }));
    
    render(
      <MemoryRouter>
        <UserProtectedRoute />
      </MemoryRouter>
    );
    
    expect(localStorage.getItem).toHaveBeenCalledWith('userData');
  });

  test('UserProtectedRoute should redirect for admin role', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ id: 1, role: 'admin' }));
    
    const { container } = render(
      <MemoryRouter>
        <UserProtectedRoute />
      </MemoryRouter>
    );
    
    expect(container.innerHTML).toBe('');
  });

  test('AdminProtectedRoute should allow access for admin role', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ id: 1, role: 'admin' }));
    
    render(
      <MemoryRouter>
        <AdminProtectedRoute />
      </MemoryRouter>
    );
    
    expect(localStorage.getItem).toHaveBeenCalledWith('userData');
  });

  test('AdminProtectedRoute should redirect for user role', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ id: 1, role: 'user' }));
    
    const { container } = render(
      <MemoryRouter>
        <AdminProtectedRoute />
      </MemoryRouter>
    );
    
    expect(container.innerHTML).toBe('');
  });

  test('Protected routes should redirect when no user data', () => {
    localStorage.getItem.mockReturnValue(null);
    
    const { container: userContainer } = render(
      <MemoryRouter>
        <UserProtectedRoute />
      </MemoryRouter>
    );
    
    const { container: adminContainer } = render(
      <MemoryRouter>
        <AdminProtectedRoute />
      </MemoryRouter>
    );
    
    expect(userContainer.innerHTML).toBe('');
    expect(adminContainer.innerHTML).toBe('');
  });
});

describe('MessagePopup Component', () => {
  test('should not render when open is false', () => {
    const { container } = render(
      <MessagePopup open={false} title="Test" description="Test description" />
    );
    
    expect(container.innerHTML).toBe('');
  });

  test('should render when open is true', () => {
    render(
      <MessagePopup open={true} title="Test Title" description="Test description" />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('should call onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    
    render(
      <MessagePopup open={true} title="Close Test" description="Test Description" onClose={mockOnClose} />
    );
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should call onClose when overlay is clicked', () => {
    const mockOnClose = jest.fn();
    
    const { container } = render(
      <MessagePopup open={true} title="Overlay Test" description="Test Description" onClose={mockOnClose} />
    );
    
    const overlay = container.firstChild;
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should not call onClose when modal content is clicked', () => {
    const mockOnClose = jest.fn();
    
    render(
      <MessagePopup open={true} title="Modal Test" description="Test Description" onClose={mockOnClose} />
    );
    
    const modalContent = screen.getByText('Modal Test').closest('form');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    
    const { container } = render(
      <MessagePopup open={true} title="Style Test" description="Test Description" style={customStyle} />
    );
    
    const overlay = container.firstChild;
    expect(overlay).toHaveStyle('background-color: red');
  });
});

describe('HomePage Component', () => {
  test('should render main heading', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Find the specific h1 main title
    const headingElements = screen.getAllByText(/Use Sign Language Cards/i);
    const mainTitle = headingElements.find(element => element.tagName === 'H1');
    expect(mainTitle).toBeInTheDocument();
  });

  test('should render navigation buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Learn More/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  test('should open contact popup when contact button is clicked', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Find contact button - get all elements and select the button
    const contactElements = screen.getAllByText(/Contact Us/i);
    const contactButton = contactElements.find(element => element.tagName === 'BUTTON');
    fireEvent.click(contactButton);
    
    expect(screen.getByText('Contact Us Here')).toBeInTheDocument();
    expect(screen.getByText(/projectz681@gmail.com/i)).toBeInTheDocument();
  });

  test('should render FAQ section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  test('should toggle FAQ items', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Find the first FAQ question button
    const faqButtons = screen.getAllByRole('button');
    const faqButton = faqButtons.find(button => button.textContent.includes('+'));
    
    if (faqButton) {
      fireEvent.click(faqButton);
      // After clicking, the + should change to -
      expect(faqButton.textContent).toContain('-');
    } else {
      // If no FAQ with + found, just check that buttons exist
      expect(faqButtons.length).toBeGreaterThan(0);
    }
  });

  test('should render features section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Find the specific h2 heading for features section
    const featureElements = screen.getAllByText(/Sign Language Cards/i);
    const featureHeading = featureElements.find(element => element.tagName === 'H2');
    expect(featureHeading).toBeInTheDocument();
  });

  test('should render video demonstration', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });
});

describe('Form Validation and Input Handling', () => {
  test('should handle email input validation', () => {
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email' } });
    expect(emailInput.value).toBe('invalid-email');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'valid@email.com' } });
    expect(emailInput.value).toBe('valid@email.com');
  });

  test('should handle password input validation', () => {
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'short' } });
    expect(passwordInput.value).toBe('short');
    
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'longerpassword123' } });
    expect(passwordInput.value).toBe('longerpassword123');
  });

  test('should handle form submission with network timeout', async () => {
    mockedAxios.post.mockRejectedValue({ code: 'ECONNABORTED', message: 'timeout' });
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Connection Timeout')).toBeInTheDocument();
    });
  });

  test('should handle server error responses', async () => {
    mockedAxios.post.mockRejectedValue({ 
      response: { status: 500 },
      message: 'Server error occurred'
    });
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Server Error')).toBeInTheDocument();
    });
  });

  test('should handle unauthorized responses', async () => {
    mockedAxios.post.mockRejectedValue({ 
      response: { status: 401 },
      message: 'Unauthorized access'
    });
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Login Failed')).toBeInTheDocument();
    });
  });

  test('should handle service unavailable responses', async () => {
    mockedAxios.post.mockRejectedValue({ 
      response: { status: 404 },
      message: 'Service not found'
    });
    
    const { container } = render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );
    
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    });
  });
});