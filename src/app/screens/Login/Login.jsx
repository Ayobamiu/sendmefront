import { Form, Input, Button, message, Spin } from "antd";
import { Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Navigate, NavLink } from "react-router-dom";
import {
  changeAuthInput,
  getLoggedInUser,
  logUserIn,
} from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const { Content } = Layout;

const NormalLoginForm = () => {
  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(logUserIn(values.username, values.password));
  };

  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);
  useEffect(() => {
    if (status === "failed") {
      message.error(error || "Unable to log in!");
    }
    dispatch(changeAuthInput("status", "pending"));
  }, [status, error, dispatch]);

  const user = getLoggedInUser();
  if (user) return <Navigate to="/" />;
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      {/* <Sider></Sider> */}
      <Content style={{}}>
        <div style={{ width: "70%", margin: "auto" }}>
          <h1 className="my-5">
            Login <Spin spinning={loading} />{" "}
          </h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                size="large"
              >
                Log in
              </Button>{" "}
              Or <NavLink to="/sign-up">register now!</NavLink>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default NormalLoginForm;
