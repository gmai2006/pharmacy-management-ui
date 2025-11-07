import React, { useEffect, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here

import init from "../init";

const getdataTarget = '/' + init.appName + '/rest/' + 'users/select/100';
const createDataTarget = '/' + init.appName + '/rest/' + 'users/';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const columns = [
  { accessorKey: 'id', header: 'id', size: 150 },
  { accessorKey: 'username', header: 'username', size: 150 },
  { accessorKey: 'displayName', header: 'displayName', size: 150 },
  { accessorKey: 'email', header: 'email', size: 150 },
  { accessorKey: 'roleId', header: 'roleId', size: 150 },
  { accessorKey: 'isActive', header: 'isActive', size: 150 },
  { accessorKey: 'createdAt', header: 'createdAt', size: 150 },
  { accessorKey: 'lastLoginAt', header: 'lastLoginAt', size: 150 },
]

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const UserSummary = () => {
  const [data, setData] = useState([]);

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const fetchData = async () => {
      
    try {
      const response = await fetch(getdataTarget, {headers: headers,}); 
      
      const jsonData = await response.json();
      setData(jsonData);
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createRow = async (row) => {
    const response = await fetch(createDataTarget, {headers: headers, method: "PUT", data: row});
    await fetchData();
  }

  const saveRow = async (row) => {
    const response = await fetch(createDataTarget, {headers: headers, method: "POST", data: row});
    await fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.userId);
    }
  };

  const deleteUser = (id) => {
    console.log(`delete ${id}`);
  }



  const handleCreateData = async ({
    values,
    table,
  }) => {
    await createRow(values);
    table.setCreatingRow(null); //exit creating mode
  };

  const handleSaveData = async ({
    values,
    table,
  }) => {
    await saveRow(values);
    table.setCreatingRow(null); //exit creating mode
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      density: 'compact', // Set the default density to compact
    },
    enableRowSelection: true,
    enableEditing: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    getRowId: (row) => row.passwordId,
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.default, //change default background color
    }),
    muiTableBodyRowProps: { hover: true },
    muiTableProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        caption: {
          captionSide: 'top',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        fontStyle: 'italic',
        fontWeight: 'normal',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
      },
    },
    onCreatingRowSave: handleCreateData,
    onEditingRowSave: handleSaveData,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Record</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Record</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Create New Record
      </Button>

        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <MaterialReactTable table={table} />;
    </div>
  )
}

export default UserSummary;