import React from "react";
import DataTable from "./components/Datable";


interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

const columns = [
  {
    Header: "ID",
    accessor: "id",
    sort: true,
  },
  {
    Header: "Nome",
    accessor: "name",
    sort: true,
  },
  {
    Header: "Idade",
    accessor: "age",
    sort: false,
    disableSortBy: true,
  },
  {
    Header: "Email",
    accessor: "email",
    sort: true,
  },
];

const data: User[] = [
  { id: 1, name: "João", age: 30, email: "joao@example.com" },
  { id: 2, name: "Maria", age: 25, email: "maria@example.com" },
  { id: 3, name: "Pedro", age: 35, email: "pedro@example.com" },
  { id: 4, name: "Ana", age: 28, email: "ana@example.com" },
  { id: 5, name: "Lucas", age: 22, email: "lucas@example.com" },
  { id: 6, name: "Carla", age: 27, email: "carla@example.com" },
];

const App: React.FC = () => {
  return <DataTable<User> columns={columns} data={data} />;
};

export default App;
