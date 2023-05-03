import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/user";
import { Roles } from "@/vars/roles";
import { setAuthTokens } from "@/utils/cookies";
import { useRouter } from "next/router";
import { signup } from "@/utils/firebase";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  country: string;
};

export default function SignUp() {
  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();
  const mutateCreateAccount = useMutation(createAccount, {
    onSuccess: (data) => {
      const { token, refreshToken, ...otherUserDetails } = data;
      setAuthTokens(token, refreshToken);
      router.replace("/");
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { email, password, ...otherDetails } = data;
    try {
      const user = await signup(data);
      const firebaseToken = await user.getIdToken();

      if (!firebaseToken) return;

      await mutateCreateAccount.mutateAsync({
        name: data.fullName,
        email: data.email,
        country: data.country,
        role: Roles.CUSTOMER,
        firebaseToken,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Full Name"
                type="text"
                autoFocus
                {...register("fullName", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                type="email"
                autoFocus
                {...register("email", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="text"
                autoFocus
                {...register("password", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Country"
                type="text"
                autoFocus
                {...register("country", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
