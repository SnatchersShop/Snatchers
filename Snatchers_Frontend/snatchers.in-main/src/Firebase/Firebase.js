  import { initializeApp } from 'firebase/app';
  import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

  const firebaseConfig = {
    apiKey: "AIzaSyAENmUL8y0z1sJhIcT3vUfJR_EXp1M0kaQ",
    authDomain: "snatchers-in.firebaseapp.com",
    projectId: "snatchers-in",
    storageBucket: "snatchers-in.appspot.com",
    messagingSenderId: "963449566299",
    appId: "1:963449566299:web:f674945174e7008fdcbb7e",
    measurementId: "G-7T3DGSN03C",
  };



  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  export { auth, provider, signInWithPopup };
