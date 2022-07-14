import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import SavingsSharpIcon from "@mui/icons-material/SavingsSharp";
import { auth, db } from "../config/firebase";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";

const Home: NextPage = () => {
  const router = useRouter();
  const [
    createUserWithEmailAndPassword,
    registerUser,
    registerLoading,
    registerError,
  ] = useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, signInUser, signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);

  const [currentUser, currentUserLoading, currentUserError] =
    useAuthState(auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function run() {
      if (registerUser) {
        const docRef = doc(db, `users`, registerUser?.user.uid);
        await setDoc(docRef, {
          totalAmount: 0,
        });
      }
    }
    run();
  }, [registerUser]);

  if (!currentUserLoading && currentUser) {
    router.push("/dashboard");
  }

  if (currentUserLoading) {
    return (
      <Box
        sx={() => ({
          backgroundColor: "#455a64",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <CircularProgress />
      </Box>
    );
  }

  // useEffect(() => {
  //   console.log(currentUserError);
  // }, [currentUserError]);
  // useEffect(() => {
  //   console.log(registerError);
  // }, [registerError]);
  // useEffect(() => {
  //   console.log(signInError);
  // }, [signInError]);

  return (
    <div>
      <Head>
        <title>Welcome!</title>
      </Head>

      <Box
        sx={() => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "10px",
          backgroundColor: "#455a64",
          width: "100vw",
          height: "100vh",
        })}
      >
        <Box
          sx={() => ({
            backgroundColor: "#b0bec5",
            width: "340px",
            height: "370px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "20px",
            boxShadow: "2",
          })}
        >
          <Avatar sx={{ m: 1, bgcolor: "white", color: "black" }}>
            <SavingsSharpIcon />
          </Avatar>
          <Box
            sx={() => ({
              backgroundColor: "black",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
              borderRadius: "100px",
              width: "300px",
            })}
          >
            <Typography
              sx={() => ({
                fontSize: "30px",
              })}
            >
              <em>C.A.$.H</em>
            </Typography>
          </Box>
          <Box
            sx={() => ({
              display: "flex",
              flexDirection: "column",
            })}
          >
            <TextField
              sx={() => ({ marginTop: "20px" })}
              margin="normal"
              required
              placeholder="Email"
              disabled={registerLoading}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              sx={() => ({
                marginBottom: "10px",
                width: "300px",
              })}
              required
              type="password"
              placeholder="Password"
              disabled={registerLoading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Box
              sx={() => ({
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "30px",
              })}
            >
              <Button
                variant="contained"
                size="medium"
                sx={{ width: "130px" }}
                onClick={(e) => {
                  e.preventDefault();
                  signInWithEmailAndPassword(username, password);
                }}
              >
                Sign In
              </Button>

              <Button
                variant="outlined"
                size="medium"
                sx={{ width: "130px" }}
                onClick={() => {
                  createUserWithEmailAndPassword(username, password);
                }}
              >
                Register
              </Button>

              {registerError && <TextField>{registerError.message}</TextField>}
              {signInError && <TextField>{signInError.message}</TextField>}
            </Box>
          </Box>
        </Box>
      </Box>

      <footer></footer>
    </div>
  );
};

export default Home;
