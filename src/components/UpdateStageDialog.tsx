import { updateStage } from "@/api/order";
import { PlantingStage } from "@/vars/roles";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useImperativeHandle } from "react";

type Props = {
  orderId: string;
  initialPlantingStage: PlantingStage;
};

type Ref = {
  open: () => void;
  close: () => void;
};

const UpdateStageDialog = React.forwardRef<Ref, Props>(
  ({ orderId, initialPlantingStage }, ref) => {
    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible((prev) => !prev);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setVisible(true),
        close: handleClose,
      }),
      []
    );
    const queryClient = useQueryClient();
    const updateMutation = useMutation(updateStage, {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]);
        handleClose();
      },
    });

    const handleMutation = async (plantingStage: PlantingStage) => {
      await updateMutation.mutateAsync({
        orderId: orderId,
        plantingStage,
      });
    };

    const handleChange = async (event: SelectChangeEvent) => {
      await handleMutation(event.target.value as PlantingStage);
    };

    return (
      <Dialog open={visible} onClose={handleClose}>
        <DialogTitle>Update Stage</DialogTitle>
        <DialogContent>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={initialPlantingStage}
            onChange={handleChange}
          >
            <MenuItem value={PlantingStage.Payment}>Payment</MenuItem>
            <MenuItem value={PlantingStage.Planting}>Planting</MenuItem>
            <MenuItem value={PlantingStage.Preparation}>Preparation</MenuItem>
            <MenuItem value={PlantingStage.Processing}>Processing</MenuItem>
            <MenuItem value={PlantingStage.Received}>Received</MenuItem>
          </Select>
        </DialogContent>
      </Dialog>
    );
  }
);

export default UpdateStageDialog;
