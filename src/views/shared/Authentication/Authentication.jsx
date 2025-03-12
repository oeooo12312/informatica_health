import React, { useState } from "react";
import { signInWithEmailAndPasswordWrapper, createUserWithEmailAndPasswordWrapper } from "../../../firebase";
import "./Authentication.css";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

/**
 * This authentication should have the following conditions :
 *      1. Voice-based for patient, visual for the rest.
 *      2. Have both sign-up and login features
 *      3. General for all patient/doctor/pharmacy
 *      4. May moodularize login and register depending on how large this file gets..
 */
function Authentication({ userType }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true); // Switch between login/signup
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Generic function to handle login or sign_up 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); // Clear previous errors

        try {
            if (isLogin) {
                // Handle Login
                await signInWithEmailAndPasswordWrapper(email, password);

                // Redirect to /dashboard

            } else {
                // Handle Sign Up
                await createUserWithEmailAndPasswordWrapper(email, password);
            }

            console.log("Successful!");
            navigate("/dashboard");
            
        } catch (err) {
            toast(
                err.message // why is this error an object ????
            );
        }
        
    };

    const toggleLoginSignup = () => {
        setIsLogin(!isLogin);
    };

    const visual_login = 
    <div className="visual_login">
    <form onSubmit={handleSubmit}>
        <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>
        <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
    </form>
        <p className="toggle-link">
        {isLogin ? (
            <>
                <span className="toggle-action">Don't have an account? </span> 
                <a className="action-link" onClick={toggleLoginSignup}>Sign Up</a>
            </>
        ) : (
            <>
                <span className="toggle-action" >Already have an account? </span> 
                <a className="action-link" onClick={toggleLoginSignup}> Login</a>
            </>
        )}
    </p>
    </div>

    return (
        <div className="auth-box">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            {userType === "patient" ? (
                <div className="voice-auth">
                    {/* Here you can integrate voice recognition logic */}
                    <p>Voice-based authentication for patients</p>
                </div>
            ) : (
                <div className="visual-auth">
                    {/* Additional logic for visual authentication */}
                    {visual_login}
                </div>
            )}
        </div>
    );
}

export default Authentication;


   