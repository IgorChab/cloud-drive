import React, { FC } from 'react'
import './DataGrid.css'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'

  function createData(name: string, calories: number, fat: number, carbs: number) {
    return { name, calories, fat, carbs };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24),
    createData('Ice cream sandwich', 237, 9.0, 37),
    createData('Eclair', 262, 16.0, 24),
    createData('Cupcake', 305, 3.7, 67),
  ];

  interface DataGridProps {
    folders: any
  }
  
  export const DataGrid: FC<DataGridProps> = ({folders}) => {
  
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folders.map((folder: any) => (
              <TableRow key={folder.id}>
                <TableCell component="th" scope="row">
                  {folder.name}
                </TableCell>
                <TableCell align="right">{folder.type}</TableCell>
                <TableCell align="right">{folder.items}</TableCell>
                <TableCell align="right">{folder.space}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
