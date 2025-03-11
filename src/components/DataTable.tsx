import React from 'react';

interface DataTableProps {
  data: any[]; // Array of data to display
  columns: string[]; // Array of column names
  onEdit: (item: any) => void; // Function to handle edit
  onDelete: (item: any) => void; // Function to handle delete
}

const DataTable = ({ data, columns, onEdit, onDelete }: DataTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-2">
                {column}
              </th>
            ))}
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t border-gray-700">
              {columns.map((column) => (
                <td key={column} className="px-4 py-2">
                  {item[column]}
                </td>
              ))}
              <td className="px-4 py-2">
                <button
                  onClick={() => onEdit(item)}
                  className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;