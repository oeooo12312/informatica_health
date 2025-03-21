import React, { useState, useEffect } from "react";
import "./Authentication.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../context/UserContext";
import { loginVoiceForm, signUpVoiceForm } from "./statemachine";
import VoiceForm from "../../../components/VoiceForm/VoiceForm";
/**
 * This authentication should have the following conditions :
 *      1. Voice-based for patient, visual for the rest.
 *      2. Have both sign-up and login features
 *      3. General for all patient/doctor/pharmacy
 *      4. May moodularize login and register depending on how large this file gets..
 *      5. Add one more page before this to check for voice-assist
 *      6. If voice-assist enabled, 
 */
function Authentication({ userType }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [voiceForm, setVoiceForm] = useState(null);
    const [isLogin, setIsLogin] = useState(true); // Switch between login/signup
    const { user, login, register } = useUserContext();
    const navigate = useNavigate();

    const resetFormfields = () => {
        setEmail("");
        setPassword("");
    }

    // Generic function to handle login or sign_up 
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLogin) {
            console.log("Hello world");
            // Handle Login
            await login(email,password, resetFormfields);
        } else {
            // Handle Sign Up
            const userData = {email, password, name, age};
            await register(userData, resetFormfields);
        }            
    };

    useEffect(() => {
        if (user) {
            console.log(user);
            navigate("/dashboard");            
        }
    }, [user])

    const toggleLoginSignup = () => {
        setIsLogin(!isLogin);
    };

    let pressTimer = null;  // Timer to detect press and hold
    const pressThreshold = 500;  // Time (in milliseconds) for press and hold detection

    // Handle mouse down (to start detecting press and hold)
    const handleMouseDown = (e) => {
        e.preventDefault();
        
        // Start the press and hold action if not already started
        if (!pressTimer) {
            pressTimer = setTimeout(() => {
                console.log("Sign up! (Press and Hold)");
                setVoiceForm(signUpVoiceForm);  // Trigger sign-up
            }, pressThreshold);
        }
    };

    // Handle mouse up (to cancel press and hold if released before threshold)
    const handleRelease = (e) => {
        e.preventDefault();
        
        // Cancel the press-and-hold if the mouse is released before the threshold
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    };

    // Handle double click (for login)
    const handleDoubleClick = (e) => {
        e.preventDefault();
        
        // Trigger login action
        console.log("Login! (Double-click)");
        setVoiceForm(loginVoiceForm);
    };

    // form is a object
    const onSubmit = async (form) => {
        console.log(form);
        const type = form['type'];
        const email = form['email'].replace(/\s+/g, "") + form['domain'] == 'GOOGLE' ? '@gmail.com' : '@hotmail.com';;
        const password = form['password'].replace(/\s+/g, "")
        const name = form['name'];
        const age = form['age'];

        if (type === 'login') {
            await login(email, password, null);
        } else {
            const userData = {
                email,
                password,
                name,
                age,
            };
            await register(userData, null);
        }

    }
    const voice_auth = 
    <div className="voice-auth">
    
        {voiceForm ? <VoiceForm voiceForm={voiceForm} onSubmit={onSubmit}></VoiceForm> : 
        <div className="press-to-start"
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleRelease}
        onMouseOut={handleRelease}></div>}
    </div>
    

    const visual_auth = 
    <div className="visual-auth">
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
            {!isLogin && 
            <div className="input-group">
                <label htmlFor="name">Name</label>
                <input 
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>}
            {!isLogin && 
            <div className="input-group">
                <label htmlFor="age">Age</label>
                <input 
                    type="number"
                    id="age"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
            />
            </div>
            }
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
                voice_auth    
            ) : (
                visual_auth
                
            )}
        </div>
    );
}

export default Authentication;


   