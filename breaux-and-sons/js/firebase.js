import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDocFromServer } from 'firebase/firestore';

// Need to go up one directory because we are in /breaux-and-sons/js and the config is in /
// However, vite will resolve from /breaux-and-sons since root is there. 
// We should import the json relative to the vite root.
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL
export const auth = getAuth();

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export { addDoc, collection, serverTimestamp };
