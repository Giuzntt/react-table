import React, { useMemo, useState } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  Column,
  TableInstance,
} from "react-table";

interface DataTableProps<T extends object> {
  columns: Column<T>[]; // Colunas tipadas genericamente
  data: T[]; // Dados tipados genericamente
}

const DataTable = <T extends object>({ columns, data }: DataTableProps<T>) => {
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  // Filtra os dados com base no valor de busca (aplica no campo "name" por padrão)
  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const searchableColumn = columns.find((col) => col.accessor === "name");
        if (searchableColumn && "name" in item) {
          return String(item["name"])
            .toLowerCase()
            .includes(search.toLowerCase());
        }
        return true;
      }),
    [data, search, columns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    allColumns,
    toggleHideColumn,
  }: TableInstance<T> = useTable<T>(
    {
      columns,
      data: filteredData, // Usa os dados filtrados
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        hiddenColumns,
      },
      disableSortRemove: true,
    },
    useSortBy,
    usePagination
  );

  const handleColumnToggle = (columnId: string) => {
    setHiddenColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
    toggleHideColumn(columnId);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "300px",
          }}
        />
      </div>
      <div>
        <h3>Exibir/Esconder Colunas</h3>
        {allColumns.map((column) => (
          <label key={column.id} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={!hiddenColumns.includes(column.id)}
              onChange={() => handleColumnToggle(column.id)}
            />
            {column.Header as string}
          </label>
        ))}
      </div>
      <table {...getTableProps()} style={{ border: "1px solid black", width: "100%", marginTop: "10px" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} style={{ borderBottom: "1px solid black" }}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(
                    column.getSortByToggleProps()
                  )}
                  style={{
                    padding: "10px",
                    cursor: column.disableSortBy ? "default" : "pointer",
                  }}
                >
                  {column.render("Header")}
                  {!column.disableSortBy && column.isSorted ? (
                    column.isSortedDesc ? (
                      " 🔽"
                    ) : (
                      " 🔼"
                    )
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{ borderBottom: "1px solid black" }}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={{ padding: "10px" }}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Página{" "}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{" "}
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Mostrar {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataTable;
