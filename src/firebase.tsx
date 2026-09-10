import { initializeApp } from "firebase/app";
import { 
  initializeAuth,
  browserLocalPersistence,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAm48sqnbBjsGrel109FiXOOoTzTLYINss",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cura-app-76158.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cura-app-76158",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cura-app-76158.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "200274389188",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:200274389188:web:4cef3eab3062edb1d50191"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with explicit local persistence immediately to prevent session drops
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});

export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication helper functions
export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

// Firestore health vault data helper functions
export const saveUserData = async (userId: string, title: string, category: string) => {
  const docRef = await addDoc(collection(db, "health_vault"), {
    user_id: userId,
    title: title,
    category: category,
    created_at: serverTimestamp()
  });
  return docRef.id;
};

export const getUserData = async (userId: string) => {
  const q = query(collection(db, "health_vault"), where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);
  const records: any[] = [];
  querySnapshot.forEach((doc) => {
    records.push({ id: doc.id, ...doc.data() });
  });
  return records;
};