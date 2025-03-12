// Login.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Authentication } from "./Authentication";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

/**
 * Before :
 */
describe("Login Component", () => {
  let mockAuthService;

  beforeEach(() => {
    // Reset mocks before each test
    mockAuthService = { login: jest.fn() };
    jest.clearAllMocks();
  });

  const setup = () => {
    render(
      <MemoryRouter>
        <Authentication authService={mockAuthService} />
      </MemoryRouter>
    );
  };

  // Generalized function to prevent repeat, keep it clean.
  const login = (email, password) => {
    fireEvent.change(screen.getById("email"), {
        target: { value: email }, // replace this with the test data in .env.test_data
    });
    fireEvent.change(screen.getById("password"), {
        target: { value: password },            // replace this with the test data in .env.test_data
    });
    
    fireEvent.click(screen.getById("login-btn")); // getting the html element by text
  
  }
  // Scenario 1 : Login with an invalid credentials.
  test("shows error toast on invalid credentials", async () => {
    mockAuthService.login.mockResolvedValue(false);
    setup();

    login(
        process.env.VITE_APP_TEST_1_EMAIL,
        process.env.VITE_APP_TEST_1_PASSWORD,
    )

    // Expected outcome : Toast error to be thrown in the front-end client side.

    await waitFor(() => {
        const toast = screen.getByText('Invalid credentials'); // Check the toast message
        expect(toast).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Scenario 2 : Login with a valid credentials.
  test("redirects to dashboard on valid credentials", async () => {
    mockAuthService.login.mockResolvedValue(true);
    setup();

    login(
        process.env.VITE_APP_TEST_2_EMAIL,
        process.env.VITE_APP_TEST_2_PASSWORD,
    )

    // Expected outcome : Navigate to the dashboard route.

    await waitFor(
        () => expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});