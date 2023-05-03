import { auth } from "@/lib/firebase";
import React, { useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getIdToken,
  User,
  UserCredential,
} from "firebase/auth";
import { deleteTokens } from "@/utils/cookies";
import { useRouter } from "next/router";

type AuthCredentials = {
  email: string;
  password: string;
};

export const signup = async ({ email, password }: AuthCredentials) => {
  const { user: newUser } = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return newUser;
};

export const signin = async ({ email, password }: AuthCredentials) => {
  const { user: newUser } = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return newUser;
};

export const signout = async () => {
  await signOut(auth);
  deleteTokens();
  //router.replace("/signin");
};
