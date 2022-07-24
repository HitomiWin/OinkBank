import {
  initializeApp
} from 'firebase/app'
import {
  getAuth
} from 'firebase/auth'
import {
  getFirestore
} from 'firebase/firestore'
// import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore(app) // firebase firesore instance
// const storage = getStorage(app)

export {
  app as
  default,
  auth,
  db,
  // storage,
}