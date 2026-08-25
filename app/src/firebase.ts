import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBcTQbO8msD6RnwoNyGtSk1YuZECSqhR0I',
  authDomain: 'lectory-prod.firebaseapp.com',
  projectId: 'lectory-prod',
  storageBucket: 'lectory-prod.firebasestorage.app',
  messagingSenderId: '63238288271',
  appId: '1:63238288271:web:a77af1695295a2572591fa'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
