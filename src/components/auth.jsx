import { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };
  const googleSignin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input placeholder="Email..." onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password..." type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={signIn}>Sign In</button>

      <button onClick={googleSignin}>Google Sign In</button>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};
