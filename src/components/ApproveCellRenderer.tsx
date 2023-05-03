import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import Button from "@mui/material/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveOrder } from "@/api/order";

const ApproveCellRenderer = (props: ICellRendererParams) => {
  const queryClient = useQueryClient();
  const approveMutation = useMutation(approveOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  const handleMutation = async () => {
    await approveMutation.mutateAsync({ orderId: props.data._id });
  };

  if (!props.data.approved) {
    return <Button onClick={handleMutation}>Approve</Button>;
  }
  return "Approved";
};

export default ApproveCellRenderer;
