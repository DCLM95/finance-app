import { auth, db } from "../config/firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  query,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { teal, pink, red } from "@mui/material/colors";

export default function Dashboard() {
  // CONST
  const [alignment, setAlignment] = useState("Cash In");
  const [newTransaction, setNewTransaction] = useState<any[]>([]);
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [transactionDetails, setTransactionDetails] = useState("");
  const [transactionType, setTransactionType] = useState("cashIn");
  const [transactionDate, setTransactionDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [transactionLable, setTransactionLabel] = useState("All Transactions");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [date, setDate] = useState("YYYY-MM-DD");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredDate = dayjs(filteredTransactions, "YYYY-MM-DD").toDate();

  const router = useRouter();

  const [currentUser, currentUserLoading, currentUserError] =
    useAuthState(auth);

  const [retrieveValue, retrieveLoading, retrieveError] = useCollection(
    query(collection(db, `users/${currentUser?.uid}/transactions`))
  );

  const [userDocument, userDocumentLoading, userDocumentError] = useDocument(
    doc(db, `users`, currentUser?.uid || "abc")
  );

  const q = query(
    collection(db, `users/${currentUser?.uid}/transactions`),
    where("transactionDate", "==", filteredDate)
  );

  // USE-EFFECT
  useEffect(() => {
    if (!currentUserLoading && !currentUser) {
      router.push("/");
    }
  }, [currentUserLoading, currentUser]);

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const retrievedData: any[] = [];
    retrieveValue?.forEach((doc) => {
      let obj: any = { ...doc.data(), id: doc.id };

      retrievedData.push(obj);
    });

    retrievedData.sort(
      (a, b) =>
        parseFloat(b.createdAt.toMillis()) - parseFloat(a.createdAt.toMillis())
    );

    setNewTransaction(retrievedData);
  }, [retrieveValue]);

  if (currentUserLoading || !currentUser) {
    return (
      <Box
        sx={() => ({
          backgroundColor: "#455a64",
          minWidth: "100vw",
          minHeigth: "100vh",
          display: "flex",
        })}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={() => ({
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      })}
    >
      {/* NAV BAR */}
      <Box
        sx={() => ({
          backgroundColor: "black",
          width: "100vw",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          color: "white",
          paddingLeft: "20px",
        })}
      >
        <Box
          sx={() => ({
            color: "white",
          })}
        >
          <h1>
            <em>C.A.$.H</em>
          </h1>
        </Box>
        <Button
          sx={() => ({
            width: "120px",
            height: "30px",
            borderRadius: "50px",
          })}
          onClick={() => {
            console.log("User clicked Sign Out Button");
            logout();
          }}
          variant="contained"
        >
          Sign Out
        </Button>
      </Box>
      {/* NAV BAR END */}

      {/* ENTIRE BODY BACKGROUND */}
      <Box
        sx={() => ({
          backgroundColor: "#455a64",
          display: "flex",
          flex: "1",
          flexDirection: "column",
          // alignItems: "center",
          gap: "10px",
          paddingTop: "20px",
        })}
      >
        {/* MIDDLE BLACK BORDER BOX */}
        <Box
          sx={() => ({
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          {/* CASH FLOW WHITE BOX */}

          <Box
            sx={() => ({
              backgroundColor: "gold",
              marginTop: "20px",
              marginLeft: "20px",
              width: "250px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "20px",
              gap: "15px",
            })}
          >
            <Box>
              <span>CASH FLOW:</span>
            </Box>
            <Box>
              <h2>
                <strong>
                  $
                  {userDocument?.data()!.totalAmount
                    ? userDocument?.data()!.totalAmount.toFixed(2)
                    : "0.00"}
                </strong>
              </h2>
            </Box>
          </Box>

          {/* CASH FLOW WHITE BOX END */}

          {/* 1st TRANSACTION DETAILS WHITE BOX START */}

          <Box
            sx={() => ({
              backgroundColor: "white",
              width: "min(900px, 95%)",
              opacity: "100%",
              paddingBottom: "20px",
              paddingX: "20px",
              margin: "20px",
              borderRadius: "20px",
            })}
          >
            <Grid
              container
              spacing={0}
              sx={() => ({
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "space-between",
                // alignItems: "center",
                gap: "20px",
              })}
            >
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={(
                  event: React.MouseEvent<HTMLElement>,
                  newAlignment: string
                ) => {
                  setAlignment(newAlignment);
                }}
              >
                <ToggleButton
                  onClick={() => {
                    console.log("Cash in button clicked");
                    setTransactionType("cashIn");
                  }}
                  value="cash-in"
                >
                  CASH IN
                </ToggleButton>
                <ToggleButton
                  onClick={() => {
                    setTransactionType("cashOut");
                    console.log("Cash out button clicked");
                  }}
                  value="cash-out"
                >
                  CASH OUT
                </ToggleButton>
              </ToggleButtonGroup>
              <TextField
                onChange={(e) => {
                  setTransactionDate(e.target.value);
                }}
                label="Date"
                type="date"
                defaultValue={dayjs().format("YYYY-MM-DD")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Box
              sx={() => ({
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
                gap: "20px",
              })}
            >
              <TextField
                disabled={isSubmitting}
                value={transactionDetails}
                id="text-content"
                onChange={(e: any) => {
                  setTransactionDetails(e.target.value);
                }}
                helperText="Please enter transaction details"
                label="Transaction Details"
              />
              <TextField
                disabled={isSubmitting}
                value={transactionAmount}
                onChange={(e: any) => {
                  setTransactionAmount(e.target.value);
                }}
                helperText="Please enter transaction amount"
                id="demo-helper-text-aligned"
                label="Transaction Amount"
                type="number"
              />

              <LoadingButton
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={async () => {
                  console.log("Submit Button Clicked");
                  setIsSubmitting(true);
                  setTransactionDetails("");
                  setTransactionAmount("");
                  if (transactionDetails !== "" && transactionAmount !== "") {
                    let amount =
                      transactionType === "cashIn"
                        ? parseFloat(transactionAmount)
                        : parseFloat(transactionAmount) * -1;
                    await addDoc(
                      collection(db, `users/${currentUser?.uid}/transactions`),
                      {
                        title: transactionDetails,
                        amount: parseFloat(transactionAmount),
                        transactionType: transactionType,
                        transactionDate: dayjs(
                          transactionDate,
                          "YYYY-MM-DD"
                        ).toDate(),
                        createdAt: new Date(),
                      }
                    );
                    const docRef = doc(db, `users`, currentUser?.uid);
                    await updateDoc(docRef, {
                      totalAmount: increment(amount),
                    });
                  }
                  setIsSubmitting(false);
                  setTransactionLabel("All Transactions");
                }}
                value={transactionDetails}
                variant="contained"
              >
                Submit
              </LoadingButton>
            </Box>
          </Box>

          {/* 1st TRANSACTION DETAILS WHITE BOX START */}
          {/* 2nd WHITE BOX START */}
          <Box
            sx={() => ({
              backgroundColor: "white",
              width: "min(900px, 95%)",
              paddingBottom: "20px",
              margin: "20px",
              borderRadius: "20px",
              // gap: "10px",
            })}
          >
            <Box
              sx={() => ({
                paddingX: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              })}
            >
              <Grid container spacing={0}>
                <Box
                  sx={() => ({
                    marginTop: "5px",
                    marginRight: "30px",
                    paddingX: "5px",
                    borderRadius: "10px",
                  })}
                >
                  <h2>{transactionLable}</h2>
                </Box>
                <Box
                  sx={() => ({
                    paddingTop: "020px",
                    display: "flex",
                    gap: "5px",
                  })}
                >
                  <Box sx={() => ({})}>
                    <TextField
                      onChange={(e) => {
                        setFilteredTransactions(e.target.value);
                        setDate(e.target.value);
                      }}
                      label="Search"
                      value={date}
                      type="date"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                  <Box
                    sx={() => ({
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: "5px",
                      height: "40px",
                    })}
                  >
                    <Button
                      size="small"
                      sx={() => ({})}
                      onClick={async () => {
                        const filteredTransactionArray: any[] = [];
                        const querySnapshot = await getDocs(q);
                        querySnapshot.forEach((doc) => {
                          filteredTransactionArray.push({
                            ...doc.data(),
                            id: doc.id,
                          });
                        });
                        setNewTransaction(filteredTransactionArray);
                        setTransactionLabel(
                          "Transactions for" +
                            " " +
                            dayjs(filteredTransactions).format(
                              "DD-MM-YYYY (dddd)"
                            )
                        );
                      }}
                      variant="outlined"
                    >
                      <SearchIcon />
                    </Button>
                    <Button
                      size="small"
                      sx={() => ({})}
                      onClick={() => {
                        const retrievedData: any[] = [];
                        retrieveValue?.forEach((doc) => {
                          let obj: any = { ...doc.data(), id: doc.id };

                          retrievedData.push(obj);
                        });

                        retrievedData.sort(
                          (a, b) =>
                            parseFloat(a.createdAt.toMillis()) -
                            parseFloat(b.createdAt.toMillis())
                        );

                        setNewTransaction(retrievedData);
                        setTransactionLabel("All Transactions");
                        setDate("YYYY-MM-DD");
                      }}
                      variant="outlined"
                    >
                      <SearchOffIcon />
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Box
                sx={() => ({
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                })}
              >
                <Paper sx={{ width: "100%" }}>
                  <TableContainer sx={{ maxHeight: 380 }}>
                    <Table
                      stickyHeader
                      sx={{
                        minWidth: 650,
                      }}
                      aria-label="sticky table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={() => ({
                              backgroundColor: "black",
                              color: "white",
                              fontWeight: "bold",
                            })}
                          >
                            Description
                          </TableCell>
                          <TableCell
                            sx={() => ({
                              backgroundColor: "black",
                              color: "white",
                              fontWeight: "bold",
                            })}
                            align="right"
                          >
                            Date
                          </TableCell>
                          <TableCell
                            sx={() => ({
                              backgroundColor: "black",
                              color: "white",
                              fontWeight: "bold",
                            })}
                            align="right"
                          >
                            Amount ($)
                          </TableCell>
                          <TableCell
                            sx={() => ({
                              backgroundColor: "black",
                              color: "white",
                              fontWeight: "bold",
                            })}
                            align="right"
                          >
                            Delete
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newTransaction
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item) => (
                            <TableRow
                              key={item.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                backgroundColor:
                                  item.transactionType === "cashIn"
                                    ? teal[200]
                                    : red[200],
                              }}
                            >
                              <TableCell component="th" scope="item">
                                {item.title}
                              </TableCell>
                              <TableCell align="right">
                                {dayjs(
                                  item.transactionDate.toDate().toDateString()
                                ).format("DD-MM-YYYY (dddd)")}
                              </TableCell>
                              <TableCell align="right">
                                {item.amount.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                <ClearIcon
                                  onClick={async () => {
                                    let amount =
                                      item.transactionType === "cashIn"
                                        ? parseFloat(item.amount) * -1
                                        : parseFloat(item.amount);
                                    console.log("Delete button clicked!");

                                    await deleteDoc(
                                      doc(
                                        db,
                                        `users/${currentUser?.uid}/transactions`,
                                        item.id
                                      )
                                    );
                                    const docRefer = doc(
                                      db,
                                      `users`,
                                      currentUser?.uid
                                    );
                                    await updateDoc(docRefer, {
                                      totalAmount: increment(amount),
                                    });
                                  }}
                                  sx={() => ({
                                    cursor: "pointer",
                                    flex: "1",
                                  })}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={newTransaction.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </Box>

              {/* 2nd WHITE BOX END */}
            </Box>
            {/* MIDDLE BLACK BORDER BOX END */}
          </Box>
          {/* ENTIRE BODY BACKGROUND END */}
        </Box>
      </Box>
    </Box>
  );
}
