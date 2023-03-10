import React, { FC } from 'react'

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from '@material-ui/core';
import {AiOutlineDownload} from 'react-icons/ai'

interface ExportCSVProps {
    csvData: Array<object>
    fileName: string
}

const ExportCSV: FC<ExportCSVProps> = ({csvData, fileName}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = (csvData: Array<object>, fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    return (
        <div 
            className='text-blue-600 cursor-pointer hover:underline'
            onClick={(e) => exportToCSV(csvData,fileName)}
        >
            <div className='flex items-center gap-1'>
                <AiOutlineDownload/>
                Export to xlsx
            </div>
        </div>
    )
}

export default ExportCSV