import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BsArrowRightCircle } from "react-icons/bs";

import { db } from "./Firebase";
import {getDoc, doc, setDoc} from "firebase/firestore";
import validator from "validator";
import { Typography } from "@mui/material";

export default function FormModal(props) {
  const { username } = props;
 
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [usrCorrect, setUserCorrect] = React.useState({
    state: false,
    text: 'deetname already occupied'
  })
  const [email, setEmail] = React.useState("");
  const [err, setErr] = React.useState({
    show: false,
    text: ''
  });

  const checkUser = async() => {
    if (username === ''){
      setUserCorrect({
        state: false,
        text: 'Please enter your deetname!'
      });
    }else{
      const username_orig = 'deet.me/' + username;
      console.log("username_mod 1---------------", username_orig);
      let username_mod = username_orig.replaceAll("/", "-");
      console.log("username_mod 2---------------", username_mod);
      const docRef = doc(db, "users", username_mod);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()){
        setUserCorrect({
          state: true,
          text: 'deetname already occupied'
        });
      }else{
        setUserCorrect({
          state: false,
          text: 'deetname already occupied'
        });
      }
    }
  }

  const handleClickOpen = async () => {
    await checkUser();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubscribe = async() => {
    console.log("name ----------- ", name);
    console.log("email ----------- ", email);

    const username_orig = 'deet.me/' + username;
    console.log("username_orig ---------------", username_orig);
    let username_mod = username_orig.replaceAll("/", "-");
    
    setErr({
      show: false,
      text: ''
    })

    
    if (name === '' || email === ''){
      setErr({
        show: true,
        text: 'Please fill the form'
      })
    } else {  
      const docRef = doc(db, "users", username_mod);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()){
        if (validator.isEmail(email)){
          const cityRef = doc(db, 'users', username_mod);
          await setDoc(cityRef, { 
            'username': username_orig,
            'name': name,
            'email': email
          });
          setUserCorrect({
            state: false,
            text: 'User Subscribed'
          });
        }else{
          setErr({
            show:true,
            text: 'Invalid Email!'
          })
        }
      }else{
        setErr({
          show: true,
          text: 'Username already exists!'
        })
      }
    }
  };

  // const styles = []

  const UserExistsBox = () => {
    return(
      <>
      <DialogActions>
        <DialogContent className="err-msg">
        <DialogContentText  sx={{ color:'black' , fontFamily: `'Montserrat Alternates', sans-serif`}}>
          
          {usrCorrect.text}
          
        </DialogContentText>
        </DialogContent>
        </DialogActions>
      </>
    )
  }

  
  return (
    <div>
      <Button onClick={handleClickOpen} size="large">
        <BsArrowRightCircle color="white" size={24} />
      </Button>
      <Dialog open={open} 
      onClose={handleClose} 
      maxWidth={"xs"}
     >
      
        {!usrCorrect.state ? 
        <UserExistsBox />: 
        <><DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle at -4% -12.9%, rgb(74, 98, 110) 0.3%, rgb(30, 33, 48) 90.2%)`,
            color:'white',
            fontFamily: `'Montserrat Alternates', sans-serif`
          }}
          variant='h5'
        >
         Be the deet!
        </DialogTitle>
        <DialogContent sx={{ background: `radial-gradient(circle at -4% -12.9%, rgb(74, 98, 110) 0.3%, rgb(30, 33, 48) 90.2%)`,color:'white' , fontFamily: `'Montserrat Alternates', sans-serif`}}>
          <DialogContentText sx={{ background: `radial-gradient(circle at -4% -12.9%, rgb(74, 98, 110) 0.3%, rgb(30, 33, 48) 90.2%)`,color:'white', fontFamily: `'Montserrat Alternates', sans-serif` }}>
          
          </DialogContentText>
          {err.show ? <DialogContentText
            sx={{
              color: 'red',
              fontSize: 15,
            }}
          >
            {err.text}
          </DialogContentText>: <></>
          }
          <TextField
          color="warning"
            autoFocus
            margin="dense"
            sx={{fontFamily: `'Montserrat Alternates', sans-serif`}}
            InputLabelProps={{style : {fontWeight:850,fontFamily: `'Montserrat Alternates', sans-serif`} }}
            id="name"
            label="Full Name"
           type="text"
            fullWidth
            variant="standard"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
           color="warning"
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            InputLabelProps={{style : {fontWeight:850,fontFamily: `'Montserrat Alternates', sans-serif`} }}
            type="email"
            fullWidth
            variant="standard"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{backgroundColor:'#28313B',color:'white' , fontFamily: `'Montserrat Alternates', sans-serif`}} onClick={handleClose}>Cancel</Button>
          <Button sx={{backgroundColor:'#28313B',color:'white' , fontFamily: `'Montserrat Alternates', sans-serif`}} onClick={handleSubscribe}>Subscribe</Button>
        </DialogActions>
        </>}
      </Dialog>
    </div>
  );
}
