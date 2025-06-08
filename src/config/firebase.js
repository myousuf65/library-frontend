import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxBlui3LfUXiEVA55UUzey1K4t-aO6SCg",
  authDomain: "tourie-94d49.firebaseapp.com",
  projectId: "tourie-94d49",
  storageBucket: "tourie-94d49.firebasestorage.app",
  messagingSenderId: "170774029187",
  appId: "1:170774029187:web:b30c64d3a49f27d79dccb6"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
