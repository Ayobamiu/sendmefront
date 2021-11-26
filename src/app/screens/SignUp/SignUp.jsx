import { Form, Input, Button, message, Spin } from "antd";
import { Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Navigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAuthInput,
  getLoggedInUser,
  signUserUp,
} from "../../../store/authSlice";
import { useEffect } from "react";

const { Content } = Layout;

const SignUp = () => {
  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(signUserUp(values));
  };

  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);
  useEffect(() => {
    if (status === "failed") {
      message.error(error || "Unable to Sign Up!");
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
            Admin SignUp <Spin spinning={loading} />{" "}
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
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your Name!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
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
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Sign Up
              </Button>{" "}
              Already have an account? <NavLink to="/login">login now!</NavLink>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default SignUp;
