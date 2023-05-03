import { ColDef, ColGroupDef, GridReadyEvent, CellValueChangedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";

type Props = {
  rowData: any[] | null;
  columnDefs: ColDef[] | ColGroupDef[];
  onGridReady?: (params: GridReadyEvent) => void;
  onCellValueChanged: (e: CellValueChangedEvent) => void;
};

const Table = React.forwardRef<AgGridReact, Props>(
  ({ rowData, columnDefs, onGridReady, onCellValueChanged }, ref) => {
    const colDefs: ColDef = useMemo(
      () => ({
        editable: true,
        floatingFilter: true,
        resizable: true,
        suppressSizeToFit: true,
      }),
      []
    );

    const gridOptions: GridOptions = useMemo(
      () => ({
        rowSelection: "multiple",
        colDefs,
        suppressRowClickSelection: true,
        suppressDragLeaveHidesColumns: true,
        animateRows: true,
        rowHeight: 40,
        headerHeight: 35,
        undoRedoCellEditing: true,
        undoRedoCellEditingLimit: 10,
        enterMovesDownAfterEdit: true,
        enableCellTextSelection: true,
        ensureDomOrder: true,
      }),
      []
    );
    return (
      <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
        <AgGridReact
          gridOptions={gridOptions}
          ref={ref} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows// Optional - registering for Grid Event
          //onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    );
  }
);

export default Table;
