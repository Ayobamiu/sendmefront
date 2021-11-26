import { Table } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";

export default function UsersTable() {
  const users = useSelector((state) => state.dashboard.users);
  const userData = users.map((i) => {
    return {
      ...i,
      key: i._id,
      age: moment().diff(i.dob, "years"),
    };
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (value) => <span>{value || "No Name"} </span>,
    },
    { title: "Email Address", dataIndex: "email", key: "email" },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
      render: (value) => (
        <span> {value === "admin" ? "Admin" : "Worker"} </span>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={userData} />
    </div>
  );
}
