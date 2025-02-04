// authServices.test.ts
import { handleRegister } from '../../src/services/authServices';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// Mock the Supabase client and useSupabaseClient hook
jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: jest.fn(),
}));

describe('authServices', () => {
  const mockSignUp = jest.fn();
  const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the Supabase client implementation
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
    });
  });

  afterAll(() => {
    // Restore the original alert implementation
    mockAlert.mockRestore();
  });

  it('should call supabase.auth.signUp with correct parameters', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    // Mock successful sign-up
    mockSignUp.mockResolvedValue({ error: null });

    await handleRegister(email, password);

    expect(mockSignUp).toHaveBeenCalledWith({
      email,
      password,
    });
  });

  it('should not show alert when registration is successful', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    // Mock successful sign-up
    mockSignUp.mockResolvedValue({ error: null });

    await handleRegister(email, password);

    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('should show alert when registration fails', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const errorMessage = 'Registration failed';

    // Mock failed sign-up
    mockSignUp.mockResolvedValue({
      error: { message: errorMessage },
    });

    await handleRegister(email, password);

    expect(mockAlert).toHaveBeenCalledWith(errorMessage);
  });

  it('should handle errors during registration', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const errorMessage = 'Network error';

    // Mock throwing an error
    mockSignUp.mockRejectedValue(new Error(errorMessage));

    await handleRegister(email, password);

    expect(mockAlert).toHaveBeenCalledWith(errorMessage);
  });
});