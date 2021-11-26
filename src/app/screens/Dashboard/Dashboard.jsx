import {
  Layout,
  PageHeader,
  Tabs,
  Button,
  Statistic,
  Descriptions,
  Modal,
  Form,
  Input,
  Spin,
  message,
  Result,
} from "antd";
import React, { useEffect, useState } from "react";
import StocksTable from "../../components/StocksTable/StocksTable";
import { useDispatch, useSelector } from "react-redux";

import UsersTable from "../../components/StocksTable/UsersTable";
import TransactionsTable from "../../components/StocksTable/TransactionsTable";
import {
  addStock,
  loadStocks,
  loadTransactions,
  loadUsers,
  changeDashboardValue,
  addUser,
} from "../../../store/dashboardSlice";
import { getLoggedInUser, logUserOut } from "../../../store/authSlice";
import { Navigate } from "react-router-dom";
const { Content, Footer } = Layout;
const { TabPane } = Tabs;

export default function Dashboard() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.dashboard.transactions);
  let totalMoney = 0;
  transactions.forEach((transaction) => {
    totalMoney += transaction.price;
  });

  const renderContent = (column = 2) => (
    <Descriptions size="small" column={column}>
      <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>

      <Descriptions.Item label="Joined ">
        {new Date(user.createdAt).toLocaleDateString()}
      </Descriptions.Item>
    </Descriptions>
  );

  const extraContent = (
    <div
      style={{
        display: "flex",
        width: "max-content",
        justifyContent: "flex-end",
      }}
    >
      <Statistic title="Available Balance" prefix="$" value={totalMoney} />
    </div>
  );

  const Content2 = ({ children, extra }) => (
    <div className="content">
      <div className="main">{children}</div>
      <div className="extra">{extra}</div>
    </div>
  );

  const stockUpdateStatus = useSelector(
    (state) => state.dashboard.stockUpdateStatus
  );

  const newUserDetails = useSelector((state) => state.dashboard.newUserDetails);
  const addUserStatus = useSelector((state) => state.dashboard.addUserStatus);
  const userAdding = useSelector((state) => state.dashboard.userAdding);
  const stockAdding = useSelector((state) => state.dashboard.stockAdding);
  const addStockStatus = useSelector((state) => state.dashboard.addStockStatus);

  useEffect(() => {
    dispatch(loadTransactions());
    dispatch(loadStocks());
    dispatch(loadUsers());
  }, [dispatch]);
  useEffect(() => {
    if (stockUpdateStatus === "success") {
      message.success("Stock Updated!");
    }
    if (stockUpdateStatus === "failed") {
      message.error("Stock Update failed!");
    }
    if (addStockStatus === "success") {
      message.success("Stock Added!");
    }
    if (addStockStatus === "failed") {
      message.error("Stock Add failed!");
    }
    if (addUserStatus === "success") {
      message.success("User Added!");
      setShowAddUserModal(false);
      setWorkerLoginModal(true);
    }
    if (addUserStatus === "failed") {
      message.error("User Add failed!");
    }
    dispatch(changeDashboardValue("stockUpdateStatus", "pending"));
    dispatch(changeDashboardValue("addStockStatus", "pending"));
    dispatch(changeDashboardValue("addUserStatus", "pending"));
  }, [stockUpdateStatus, addStockStatus, addUserStatus, dispatch]);

  const [current, setCurrent] = useState("all-stock");
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [workerLoginModal, setWorkerLoginModal] = useState(false);

  const user = getLoggedInUser();
  if (!user) return <Navigate to="/login" />;
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      {/* <Sider></Sider> */}
      <Content className="p-1 p-md-5">
        <PageHeader
          style={{ marginBottom: "30px", padding: 0 }}
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="Dashboard"
          backIcon={null}
          subTitle={user.access === "admin" ? "Admin Access" : "Worker Access"}
          extra={[
            <Button key="3" type="link" onClick={() => dispatch(logUserOut())}>
              Log Out
            </Button>,
            <Button
              key="2"
              onClick={() => {
                if (user.access === "admin") {
                  setShowAddStockModal(true);
                } else {
                  message.warn("You are not Authorized to Add stocks!");
                }
              }}
            >
              Add Stock
            </Button>,
            <Button
              key="1"
              type="primary"
              onClick={() => {
                if (user.access === "admin") {
                  setShowAddUserModal(true);
                } else {
                  message.warn("You are not Authorized to Create Users!");
                }
              }}
            >
              Create User
            </Button>,
          ]}
          footer={
            <Tabs
              defaultActiveKey="all-stock"
              onChange={(keyString) => {
                setCurrent(keyString);
              }}
            >
              <TabPane tab="Stock" key="all-stock" />
              <TabPane tab="Transactions" key="transactions" />
              {user.access === "admin" && <TabPane tab="Workers" key="users" />}
            </Tabs>
          }
        >
          <Content2 extra={extraContent}>{renderContent()}</Content2>
        </PageHeader>

        {current === "transactions" && <TransactionsTable />}
        {current === "users" && <UsersTable />}
        {current === "all-stock" && <StocksTable />}
        <Footer style={{ textAlign: "center" }}>SendMe NG</Footer>

        <Modal
          title="Add User"
          visible={showAddUserModal}
          footer={null}
          onCancel={() => setShowAddUserModal(false)}
        >
          <Form
            layout="vertical"
            name="add-user"
            initialValues={{}}
            onFinish={(values) => {
              // setTimeout(() => {

              //   // message.success("User added successfully!");
              // }, 2000);
              dispatch(addUser(values));
            }}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your Name!",
                },
              ]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input type="email" placeholder="email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="dob"
              rules={[
                {
                  required: true,
                  message: "Please input worker's Date of birth!",
                },
              ]}
              label="Date of Birth"
              wrapperCol
            >
              <Input type="date" placeholder="Date of birth" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                disabled={userAdding}
              >
                {userAdding ? <Spin spinning={userAdding} /> : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Worker's Login"
          visible={workerLoginModal}
          footer={null}
          onCancel={() => setWorkerLoginModal(false)}
        >
          <Result
            status="success"
            title="Successfully Registered Worker!"
            subTitle={`Email:${newUserDetails?.email} \n  Password: ${newUserDetails?.password}`}
            children={
              <div className="text-center">
                This will show once. You won't see this details again for
                security reasons.
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  var textField = document.createElement("textarea");
                  textField.innerText = `Email:${newUserDetails?.email} \n  Password: ${newUserDetails?.password}`;
                  document.body.appendChild(textField);
                  textField.select();
                  document.execCommand("copy");
                  textField.remove();
                  message.success("Copied to clipboard!");
                  setWorkerLoginModal(false);
                }}
              >
                Copy Credentials to Clipboard
              </Button>,
              <Button
                key="buy"
                onClick={() => {
                  setWorkerLoginModal(false);
                }}
              >
                Cancel
              </Button>,
            ]}
          />
        </Modal>

        <Modal
          title="Add Stock"
          visible={showAddStockModal}
          footer={null}
          onCancel={() => setShowAddStockModal(false)}
        >
          <Form
            name="add-stock"
            initialValues={{}}
            onFinish={(values) => {
              dispatch(addStock(values));
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
              <Input placeholder="Title" />
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
              <Input placeholder="Description" />
            </Form.Item>

            <Form.Item
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Please input product amount!",
                },
              ]}
            >
              <Input type="number" placeholder="Cost value" />
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
                disabled={stockAdding}
              >
                {stockAdding ? <Spin spinning={stockAdding} /> : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
