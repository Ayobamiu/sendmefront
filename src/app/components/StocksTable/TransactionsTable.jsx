import { Badge, Button, DatePicker, Modal, Table, Tag } from "antd";
import React from "react";
import { useState } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadTransactions } from "../../../store/dashboardSlice";

const columns = [
  { title: "Description", dataIndex: "description", key: "description" },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (value) => <span>$ {value} </span>,
  },
  { title: "Date", dataIndex: "date", key: "date" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (tag) => {
      let color = tag?.toLowerCase() === "inactive" ? "volcano" : "green";

      return (
        <Tag color={color} key={tag} className="capitalize">
          {tag.toUpperCase()}
        </Tag>
      );
    },
  },
];

const { RangePicker } = DatePicker;
export default function TransactionsTable() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.dashboard.transactions);
  const transactionData = transactions.map((i) => {
    return {
      ...i,
      key: i._id,
      amount: i.price,
      date: new Date(i.createdAt).toLocaleDateString(),
    };
  });
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  useEffect(() => {
    if (dateRange) {
      dispatch(
        loadTransactions({ startDate: dateRange[0], endDate: dateRange[1] })
      );
    } else {
      dispatch(loadTransactions());
    }
  }, [dateRange, dispatch]);
  return (
    <div>
      <Table
        columns={columns}
        dataSource={transactionData}
        footer={() => (
          <div className="d-flex align-items-center">
            <Button
              type="link"
              className="d-flex align-items-center text-primary cursor"
              onClick={() => setShowDateModal(true)}
            >
              <FilterOutlined /> <span className="mx-2">Filter by date</span>{" "}
            </Button>
            {dateRange && (
              <span>
                <span className="text-secondary">
                  {new Date(dateRange[0]).toDateString()} to{" "}
                  {new Date(dateRange[0]).toDateString()}{" "}
                </span>{" "}
                <Button type="link" onClick={() => setDateRange(null)}>
                  <Badge count="Remove Filter" className="mx-3" />
                </Button>
              </span>
            )}
          </div>
        )}
      />
      <Modal
        title="Filter By Date"
        visible={showDateModal}
        onCancel={() => setShowDateModal(false)}
        onOk={() => setShowDateModal(false)}
      >
        <RangePicker
          onChange={(date, dateString) => {
            if (dateString) {
              if (dateString[0] && dateString[1]) {
                setDateRange(dateString);
              }
            }
          }}
        />
      </Modal>
    </div>
  );
}
