import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCNpQtGZk7WLDloY4Q7VT6CDNMtvI_mXMs",
  authDomain: "auth-test-27cd0.firebaseapp.com",
  databaseURL: "https://auth-test-27cd0-default-rtdb.firebaseio.com",
  projectId: "auth-test-27cd0",
  storageBucket: "auth-test-27cd0.appspot.com",
  messagingSenderId: "1088826370823",
  appId: "1:1088826370823:web:df72eb10cc0ed9356ab3a2",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export default app
export const firestore = getFirestore(app)
export const database = getDatabase(app)
export const storage = getStorage(app)
