import { Table } from "antd";
import React, { useState } from "react";
import { DeleteOutlined, EditTwoTone } from "@ant-design/icons";
import { Button, Modal, Form, Input, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStock,
  deleteStock,
  changeDashboardValue,
} from "../../../store/dashboardSlice";
import { useEffect } from "react";
import { getLoggedInUser } from "../../../store/authSlice";

export default function StocksTable() {
  const user = getLoggedInUser();
  const stocks = useSelector((state) => state.dashboard.stocks);
  const stockUpdating = useSelector((state) => state.dashboard.stockUpdating);
  const stockDeleteStatus = useSelector(
    (state) => state.dashboard.stockDeleteStatus
  );
  const stockDeleting = useSelector((state) => state.dashboard.stockDeleting);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (stockDeleteStatus === "success") {
      message.success("Stock Deleted!");
    }
    if (stockDeleteStatus === "failed") {
      message.error("Stock Delete failed!");
    }

    dispatch(changeDashboardValue("stockDeleteStatus", "pending"));
  }, [stockDeleteStatus, dispatch]);
  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => <span>$ {value} </span>,
    },
    { title: "Count", dataIndex: "count", key: "count" },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (value) => (
        <EditTwoTone
          style={{ color: "green" }}
          onClick={() => {
            if (user.access === "admin") {
              setShowUpdateStockModal(true);
              setSelectedStock(value);
            } else {
              message.warn("You are not Authorized to Edit!");
            }
          }}
        />
      ),
    },
    {
      title: stockDeleting ? <Spin spinning={stockDeleting} /> : "",
      dataIndex: "",
      key: "x",
      render: (value) => (
        <DeleteOutlined
          style={{ color: "red" }}
          onClick={() => {
            if (user.access === "admin") {
              dispatch(deleteStock(value._id));
            } else {
              message.warn("You are not Authorized to Delete!");
            }
          }}
        />
      ),
    },
  ];

  const stockData = stocks.map((i) => {
    return {
      ...i,
      key: i._id,
      price: i.amount,
    };
  });

  return (
    <div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.description}</p>
          ),
          rowExpandable: (record) => record.name !== "",
        }}
        dataSource={stockData}
      />
      <Modal
        title="Update Stock"
        visible={showUpdateStockModal}
        footer={null}
        onCancel={() => setShowUpdateStockModal(false)}
      >
        <Form
          name="update-stock"
          initialValues={{ ...selectedStock }}
          onFinish={(values) => {
            let noChanges = false;
            noChanges =
              values.title === selectedStock.title &&
              values.description === selectedStock.description &&
              values.count === selectedStock.count;

            const data = {};
            if (values.title !== selectedStock.title) {
              data.title = values.title;
            }
            if (values.description !== selectedStock.description) {
              data.description = values.description;
            }
            if (values.count !== selectedStock.count) {
              data.count = values.count;
            }
            if (noChanges) {
              message.warning("No changes made!");
            } else {
              // setTimeout(() => {
              //   message.success("Stock updated successfully!");
              // }, 2000);
              dispatch(updateStock(selectedStock._id, data));
            }
          }}
        >
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Please input product title!",
              },
            ]}
          >
            <Input placeholder="title" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please input product description!",
              },
            ]}
          >
            <Input placeholder="description" />
          </Form.Item>

          <Form.Item
            name="count"
            rules={[
              {
                required: true,
                message: "Please input product count!",
              },
            ]}
          >
            <Input type="number" placeholder="Count" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={stockUpdating}
            >
              {stockUpdating ? <Spin spinning={stockUpdating} /> : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
