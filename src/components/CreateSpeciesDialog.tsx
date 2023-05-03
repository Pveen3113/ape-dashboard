import React, { useImperativeHandle, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useSpecies } from "@/queries/queries";

type Ref = {
  open: () => void;
  close: () => void;
};

type Props = {
  handleCreateSpecies: (data: FormValues) => Promise<void>;
};

type FormValues = {
  name: string;
  scientificName: string;
  description: string;
};

const CreateSpeciesDialog = React.forwardRef<Ref, Props>(
  ({ handleCreateSpecies }, ref) => {
    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible((prev) => !prev);
    const {
      register,
      handleSubmit,
      reset,
      formState: { submitCount, isSubmitting: isFormLoading, errors },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
      await handleCreateSpecies(data);
      console.log(data);
      reset();
      handleClose();
    };
    useImperativeHandle(
      ref,
      () => ({
        open: () => setVisible(true),
        close: handleClose,
      }),
      []
    );

    return (
      <Dialog open={visible} onClose={handleClose}>
        <DialogTitle>Create Species</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              type="text"
              autoFocus
              {...register("name", { required: true })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Scientific Name"
              type="text"
              autoFocus
              {...register("scientificName", { required: true })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              type="text"
              autoFocus
              {...register("description", { required: true })}
            />
            <Button type="submit">Create</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

export default CreateSpeciesDialog;
