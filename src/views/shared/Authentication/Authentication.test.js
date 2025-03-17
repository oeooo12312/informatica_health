// // Login.test.js
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { useNavigate, MemoryRouter } from 'react-router-dom';
// import Authentication from './Authentication';

// // Mock the necessary parts
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: jest.fn(),
// }));

// jest.mock('react-hot-toast', () => ({
//   toast: {
//     error: jest.fn(),
//     success: jest.fn(),
//   },
// }));

// // Setup function to render the component with the necessary context
// const setup = () => {
//     render(
//       <MemoryRouter>
//         <Authentication/>
//       </MemoryRouter>
//     );
//   };


// describe("Login Component", () => {

//   const mockNavigate = useNavigate(); // useNavigate is mocked now

//   // Generalized function to prevent repeat, keep it clean.
//   const login = (email, password) => {
//     fireEvent.change(screen.getByTestId("email"), {
//       target: { value: email },
//     });
//     fireEvent.change(screen.getByTestId("password"), {
//       target: { value: password },
//     });

//     fireEvent.click(screen.getByTestId("login-btn"));
//   }

//   // Scenario 1: Login with invalid credentials.
//   test("shows error toast on invalid credentials", async () => {
//     login(
//       process.env.VITE_APP_TEST_1_EMAIL,
//       process.env.VITE_APP_TEST_1_PASSWORD,
//     );

//     // Expected outcome: Toast error to be shown
//     await waitFor(() => {
//       expect(require('react-hot-toast').toast.error).toHaveBeenCalled();
//     });
//   });

//   // Scenario 2: Login with valid credentials.
//   test("redirects to dashboard on valid credentials", async () => {
//     login(
//       process.env.VITE_APP_TEST_2_EMAIL,
//       process.env.VITE_APP_TEST_2_PASSWORD,
//     );

//     // Expected outcome: Navigate to the dashboard route
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
//     });
//   });
// });