import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.API_URL,
  authDomain: process.env.APP_AUTH_DOMAIN,
  databaseURL: process.env.APP_DATABASE_URL,
  projectId: process.env.APP_PROJECT_ID,
  storageBucket: process.env.APP_STORAGE_BUCKET,
  messagingSenderId: process.env.APP_MESSAGING_SENDER_ID,
  appId: process.env.APP_APP_ID,
}
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export default app
export const firestore = getFirestore(app)
export const database = getDatabase(app)
export const storage = getStorage(app)
