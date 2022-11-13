import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './App.css';
import { useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDunroa12ghAtz5mg80pTx-O4Hz6tuYUis",
  authDomain: "probable-analog-363319.firebaseapp.com",
  projectId: "probable-analog-363319",
  storageBucket: "probable-analog-363319.appspot.com",
  messagingSenderId: "1059452351720",
  appId: "1:1059452351720:web:ce9958fed7fb2d2f5d855d",
  measurementId: "G-123P9P8JE8"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Budget Buddy</h1>
        <SignOut />
      </header>

      <section>
        {user ? (<Budgetspace />) : <SignIn />}
      </section>

    </div>
  );
}
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Google Sign In</button>
      <p>The student budget buddy</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function Budgetspace() {
  const dummy = useRef();
  const moneyRef = firestore.collection('money');
  const query = moneyRef.orderBy('createdAt').limit(25);

  const [money] = useCollectionData(query, { idField: 'id' });

  const [formValues, setFormValues] = useState('');
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid} = auth.currentUser;

    await moneyRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  const sendmoney = async (e) => {
    e.preventDefault();

    const { uid} = auth.currentUser;

    await moneyRef.add({
      text: formValues,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })

    setFormValues('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  

  return (<>
    <main>

      {money && money.map(msg => <Amount key={msg.id} message={msg} />)}
      <span ref={dummy}></span>

    </main>

    <form class ="budget-form" onSubmit={sendmoney}>

      <input type="number" value={formValues} onChange={(e) => setFormValues(e.target.value)} placeholder="Enter your expense" />

      <button type="submit" disabled={!formValues}></button>

    </form>
    <div>
    <form class ="expense-form" onSubmit={sendMessage}>

      <input type="number" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter your budget" />

      <button type="submit" disabled={!formValue}></button>

    </form>
    </div>

  </>)
 

}


function Amount(props) {
  const { text, uid} = props.message;

  const budgetAmount = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`budget ${budgetAmount}`}>
      <p>{text}</p>
    </div>
  </>)
}

export default App;
