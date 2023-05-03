import Table from "@/components/Table";
import Container from "@mui/material/Container";
import {
  ColDef,
  ColGroupDef,
  Grid,
  GridOptions,
  GridReadyEvent,
  CellValueChangedEvent,
} from "ag-grid-community";
import React, { useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useOrders } from "@/queries/order";
import ApproveCellRenderer from "@/components/ApproveCellRenderer";
import UpdateCellRenderer from "@/components/UpdateCellRenderer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCoordinates } from "@/api/order";

export interface IOlympicData {
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

const Orders = () => {
  const agGridRef = useRef<React.ElementRef<typeof Table>>(null);
  const queryClient = useQueryClient();
  const { data: orders } = useOrders();
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Customer Details",
      children: [
        {
          field: "user.name",
          width: 180,
          filter: "agTextColumnFilter",
        },
        {
          field: "user.country",
          width: 90,
          filter: "agNumberColumnFilter",
        },
      ],
    },
    {
      headerName: "Process",
      children: [
        {
          field: "plantingStage",
          width: 140,
          cellRenderer: UpdateCellRenderer,
        },
        {
          columnGroupShow: "open",
          field: "approved",
          width: 100,
          cellRenderer: ApproveCellRenderer,
        },
        {
          columnGroupShow: "open",
          field: "update",
          width: 100,
          //filter: "agNumberColumnFilter",
        },
      ],
    },
    {
      headerName: "Resources",
      children: [
        { field: "certificate", width: 140 },
        {
          columnGroupShow: "closed",
          field: "images",
          width: 100,
          filter: "agNumberColumnFilter",
        },
        { field: "coordinates", editable: true },
      ],
    },
  ]);

  const updateCoordinatesMutation = useMutation(updateCoordinates, {
    // onMutate: async () => {
    //   await queryClient.cancelQueries({ queryKey: ["orders"] });
    //   const previousData = queryClient.getQueryData(["orders"]);
    //   const prevOrder = previousData.fin
    //   queryClient.setQueryData(["orders"], {
    //     ...previousData,
    //     movie: {
    //       ...previousData.movie,
    //       comment,
    //     },
    //   });

    //   return { previousData };
    // },
    // onError: (_, __, context) => {
    //   queryClient.setQueryData(movieKeys.detail(movieId), context.previousData);
    // },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);
  console.log(orders);

  const onCellValueChanged = useCallback(async (e: CellValueChangedEvent) => {
    await updateCoordinatesMutation.mutateAsync({
      orderId: e.data._id,
      coordinates: e.newValue,
    });
  }, []);

  if (!orders) {
    return <h1>Loading</h1>;
  }
  return (
    <Table
      ref={agGridRef}
      columnDefs={columnDefs}
      rowData={orders}
      onCellValueChanged={onCellValueChanged}
      //onGridReady={onGridReady}
    />
  );
};

export default Orders;
