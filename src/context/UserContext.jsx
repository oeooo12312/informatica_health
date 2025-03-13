// will use it if need to later..import { createContext, useContext, useState, useEffect } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithEmailAndPasswordWrapper, createUserWithEmailAndPasswordWrapper, signOutWrapper } from '../firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically set user if already logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPasswordWrapper(email, password);
      setUser(auth.currentUser);
      navigate('/dashboard');
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPasswordWrapper(email, password);
      setUser(auth.currentUser);
      navigate('/dashboard');
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const logout = () => {
    signOutWrapper(
      () => {
        setUser(null);
        navigate('/');
        toast.success('Logged out successfully!');
      },
      (err) => toast.error(err.message)
    );
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};