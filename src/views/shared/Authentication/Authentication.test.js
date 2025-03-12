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

  // Scenario 1 : Login with an invalid credentials.
  test("shows error toast on invalid credentials", async () => {
    mockAuthService.login.mockResolvedValue(false);
    setup();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "wrongUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongPass" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials")
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Scenario 2 : Login with a valid credentials.
  test("redirects to dashboard on valid credentials", async () => {
    mockAuthService.login.mockResolvedValue(true);
    setup();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "correctUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "correctPass" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});