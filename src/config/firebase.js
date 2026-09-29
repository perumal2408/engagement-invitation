// Firebase Firestore Realtime Configuration for Laxman & Abi Engagement Guestbook

export const firebaseConfig = {
  apiKey: "AIzaSyBIJ9LUyDWTaofzG6N02IE-HFrmsEn9G2A",
  authDomain: "laxman-abi-engagement.firebaseapp.com",
  projectId: "laxman-abi-engagement",
  storageBucket: "laxman-abi-engagement.firebasestorage.app",
  messagingSenderId: "364306015124",
  appId: "1:364306015124:web:a2496fe6b8028f1e762581"
};

// Check if Firebase is configured with real credentials
export function isFirebaseConfigured() {
  return (
    Boolean(firebaseConfig.apiKey) &&
    !firebaseConfig.apiKey.includes("YOUR_") &&
    Boolean(firebaseConfig.projectId) &&
    !firebaseConfig.projectId.includes("YOUR_")
  );
}
