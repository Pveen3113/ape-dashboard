import React, { useState, useRef } from "react";
import { ICellRendererParams } from "ag-grid-community";
import Button from "@mui/material/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveOrder, updateStage } from "@/api/order";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { PlantingStage } from "@/vars/roles";
import Chip from "@mui/material/Chip";
import UpdateStageDialog from "./UpdateStageDialog";

const UpdateCellRenderer = (props: ICellRendererParams) => {
  const updateStageDialogRef =
    useRef<React.ElementRef<typeof UpdateStageDialog>>(null);
  return (
    <>
      <Chip
        label={props.data.plantingStage}
        onClick={() => updateStageDialogRef.current?.open()}
      />
      <UpdateStageDialog
        ref={updateStageDialogRef}
        orderId={props.data._id}
        initialPlantingStage={props.data.plantingStage}
      />
    </>
  );
};

export default UpdateCellRenderer;
