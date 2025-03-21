// userContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Automatically set user if already logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // If no user is logged in, set user to null
    });
  
    return () => unsubscribe(); // Cleanup
  }, []);

  // CRUD operations for Firestore
  const createUserData = async (userId, name, age) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        name,
        age
      });
      toast.success('User data created!');
    } catch (error) {
      console.error("Error creating user data:", error);
      toast.error('Failed to create user data');
    }
  };

  const fetchUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const updateUserData = async (uid, name, age) => {
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, {
        name,
        age
      });
      toast.success('User data updated!');
    } catch (error) {
      console.error("Error updating user data:", error.message);
      toast.error('Failed to update user data');
    }
  };

  const deleteUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);

    try {
      await deleteDoc(userRef);
      toast.success('User data deleted!');
    } catch (error) {
      console.error("Error deleting user data:", error.message);
      toast.error('Failed to delete user data');
    }
  };

  const login = async (email, password, callback) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
  
      if (userCredentials) {
        setUser(userCredentials.user.uid);
        toast.success('Logged in successfully!');
      } else {
        toast.error('User not found!');
        callback();
      }
    } catch (error) {
      toast.error(error.message);
      callback();
    }
  };
  
  const register = async (userData, callback) => {
    createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then((userCredentials) => {
        createUserData(userCredentials.user.uid, userData.name, userData.age);
        setUser(userCredentials.user.uid);
        toast.success('Account created successfully!');
      }).catch((error) => {
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
        toast.error(err.message);
      });
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, fetchUserData, updateUserData, deleteUserData }}>
      {children}
    </UserContext.Provider>
  );
};