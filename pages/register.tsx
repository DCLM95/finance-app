import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Link,
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

  return (
    <div>
      <Head>
        <title>Welcome!</title>
      </Head>

      <Box
        sx={() => ({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "10px",
          backgroundColor: "#455a64",
          width: "100vw",
          height: "100vh",
          gap: "20px",
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
              <em>C.A.$.H / Register</em>
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
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "30px",
                gap: "10px",
              })}
            >
              <Box>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{ width: "min(200px)" }}
                  onClick={(e) => {
                    e.preventDefault();
                    createUserWithEmailAndPassword(username, password);
                  }}
                >
                  Register
                </Button>
              </Box>
              <Box>
                {registerError && <text>Error: Invalid Email or Password</text>}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={() => ({
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          })}
        >
          <Box
            sx={() => ({
              color: "white",
            })}
          >
            Already a member ?
            <Link
              onClick={() => {
                router.push("/dashboard");
              }}
              sx={() => ({
                color: "white",
                backgroundColor: "black",
                borderRadius: "10px",
                marginLeft: "10px",
                padding: "10px",
                cursor: "pointer",
              })}
            >
              Login Now!
            </Link>
          </Box>
        </Box>
      </Box>

      <footer></footer>
    </div>
  );
};

export default Home;
