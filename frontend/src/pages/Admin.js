import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Input, Button, Card, Table, Spin, message, Layout, Row, Col } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const { Header, Content } = Layout;

const Admin = () => {
  const { isLoggedIn, token, login, logout } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/applications/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 401) {
        logout();
        localStorage.removeItem('authToken');
        message.error('Сесія закінчилась. Будь ласка, увійдіть знову');
      } else {
        message.error('Помилка при завантаженні заявок');
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchApplications();
    }
  }, [isLoggedIn, token, fetchApplications]);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        '/api/auth/login',
        null,
        {
          params: {
            username: values.username,
            password: values.password,
          },
        }
      );

      const newToken = response.data.access_token;
      login(newToken);
      message.success('Успішно увійшли!');
      form.resetFields();
    } catch (error) {
      console.error('Login error:', error);
      message.error('Невірне ім\'я користувача або пароль');
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
    setApplications([]);
    message.success('Ви вийшли');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Вакансія',
      dataIndex: ['vacancy', 'job_title'],
      key: 'vacancy',
    },
    {
      title: "Ім'я",
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <a href={`tel:${text}`}>{text}</a>,
    },
    {
      title: 'Резюме',
      dataIndex: 'resume_link',
      key: 'resume_link',
      render: (text) => text ? <a href={text} target="_blank" rel="noopener noreferrer">Посилання</a> : '-',
    },
    {
      title: 'Дата',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString('uk-UA'),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
  ];

  if (!isLoggedIn) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header style={{ background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>ALDAR ZS — Адмін-панель</h1>
        </Header>
        <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
          <Card style={{ width: 400 }} title="Вхід">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              loading={loading}
            >
              <Form.Item
                label="Ім'я користувача"
                name="username"
                rules={[{ required: true, message: 'Введіть ім\'я користувача' }]}
              >
                <Input placeholder="admin" />
              </Form.Item>

              <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введіть пароль' }]}
              >
                <Input.Password placeholder="••••••" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Увійти
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>ALDAR ZS — Адмін-панель</h1>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Вихід
        </Button>
      </Header>
      <Content style={{ padding: '50px' }}>
        <div className="container">
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card title="Заявки на вакансії">
                <Spin spinning={loading}>
                  <Table
                    columns={columns}
                    dataSource={applications}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Немає заявок' }}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Admin;
