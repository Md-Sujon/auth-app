import react, { useState } from 'react'
import './App.css';

import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Auth';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [newUser,SetNewUser]=useState(false);
  const [user, setUser] = useState({
    inSignedIn: false,
    
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {

    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signInUser)
      })
      .catch(err => { })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          
          name: '',
          photo: '',
          email: '',
          error: '',
          success: false
        }
        setUser(signOutUser)
      })
      .catch(err => { })
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber
    }
    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
  }
  const handleClick = (e) => {
    if (newUser && user.name && user.password) {
      console.log(user.name, user.password, "submit")
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log(res)
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });

    }

if(!newUser && user.email && user.password){

  firebase.auth().signInWithEmailAndPassword(user.email,user.password)
  .then(res => {
    const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log(res)
  })
  .catch((error) => {
    const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
  });
}

    e.preventDefault();
  }
  return (
    <div className="App">
      <h1>Who Are You</h1>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>sign out</button> :
          <button onClick={handleSignIn}>sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>welcome: {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={()=>SetNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">new sign Up</label>

      <form onSubmit={handleSubmit}>
        {newUser &&<input name="name" type="text" onBlur={handleBlur} placeholder="Enter Your Name" />}
        <br />
        <input type="email" name="email" onBlur={handleBlur} placeholder="Your Email Address" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="You Password Hare" required />
        <br />
        {/* <input type="submit" value="submit" /> */}
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && <p style={{ color: 'green' }}>User {newUser?'Created':'Logged In'} Successfully</p>}
      <button onClick={handleClick}>submit</button>
    </div>
  );
}

export default App;