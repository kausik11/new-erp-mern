// components/ProjectTable.jsx
import { AgGridReact } from '@ag-grid-community/react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function ProjectTable() {
  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(res => res.data),
  });

  const columnDefs = [
    { field: 'name', filter: true },
    { field: 'client.name', headerName: 'Client' },
    { field: 'status', filter: 'agSetColumnFilter' },
  ];

  return (
    <div className="ag-theme-alpine h-96">
      <AgGridReact rowData={data?.data} columnDefs={columnDefs} pagination />
    </div>
  );
}