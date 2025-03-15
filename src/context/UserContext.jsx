// will use it if need to later..import { createContext, useContext, useState, useEffect } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Automatically set user if already logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const login = async (email, password, callback) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => { 
        if (userCredentials) { // not sure if this is needed ...
            setUser(userCredentials.user);
            toast.success('Logged in successfully!');
        } else {
            toast.error('User not found!');
            callback();
        }
    
    }).catch((error) =>{
        toast.error(error.message);
        callback();
    });
  };

  const register = async (email, password, callback) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
        setUser(userCredentials.user);
        toast.success('Account created successfully!');
    }).catch((error) =>{
        toast.error(error.message);
        callback();
    });
  };

  const logout = () => {
    signOut(auth)
    .then(() => {
        setUser(null);
        toast.success('Logged out successfully!');
    }).catch((err) => {
        toast.error(err.message)
    })
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};