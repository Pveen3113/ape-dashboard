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
import { Box, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";
import { useSpecies } from "@/queries/queries";

type Ref = {
  open: () => void;
  close: () => void;
};

type Props = {
  handleCreateOrder: (data: FormValues) => Promise<void>;
};

type FormValues = {
  greetings: string;
  plants: {
    species: string;
    quantity: number;
  }[];
};

const CreateOrderDialog = React.forwardRef<Ref, Props>(({handleCreateOrder}, ref) => {
  const [visible, setVisible] = useState(false);
  const handleClose = () => setVisible((prev) => !prev);
  const { data: species, isLoading: isLoadingSpecies } = useSpecies();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { submitCount, isSubmitting: isFormLoading, errors },
  } = useForm<FormValues>();
  const { fields, append, remove } = useFieldArray<FormValues>({
    name: "plants",
    control,
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await handleCreateOrder(data);
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
      <DialogTitle>Create Order</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            fullWidth
            label="Product title"
            type="text"
            autoFocus
            {...register("greetings", { required: true })}
          />
          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <TextField
                  select
                  fullWidth
                  label="Select"
                  defaultValue=""
                  inputProps={register(`plants.${index}.species`, {
                    required: "Please choose species ID",
                  })}
                >
                  {species?.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Quantity"
                  type="number"
                  autoFocus
                  {...register(`plants.${index}.quantity`, {
                    required: true,
                    min: 1,
                  })}
                />
                <Button type="button" onClick={() => remove(index)}>
                  Delete
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            onClick={() =>
              append({
                species: species?.[0]._id || "",
                quantity: 1,
              })
            }
          >
            APPEND
          </Button>
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateOrderDialog;
