import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Spin, Empty, Collapse, Form, Input, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import vacancyService from '../services/vacancyService';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const response = await vacancyService.getVacancies();
      setVacancies(response.data);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      message.error('Помилка під час завантаження вакансій');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (values) => {
    setSubmitting(true);
    try {
      const applicationData = {
        ...values,
        vacancy_id: selectedVacancy.id,
      };

      await vacancyService.applyForVacancy(applicationData);

      message.success('Ваша заявка успішно надіслана!');
      form.resetFields();
      setSelectedVacancy(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('Ошибка при отправке заявки');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={2} style={{ color: '#2c3e50' }}>
            Вакансії
          </Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
            Долучайтеся до команди професіоналів ALDAR ZS
          </Paragraph>
        </div>

        {vacancies.length === 0 ? (
          <Empty description="Наразі немає відкритих вакансій" />
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={selectedVacancy ? 12 : 24}>
              <Collapse accordion>
                {vacancies.map((vacancy) => (
                  <Panel
                    header={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {vacancy.job_title}
                        </span>
                        <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                          {vacancy.salary}
                        </span>
                      </div>
                    }
                    key={vacancy.id}
                  >
                    <div className="vacancy-content">
                      <Title level={4}>Опис:</Title>
                      <Paragraph>{vacancy.description}</Paragraph>
                      
                      <Title level={4}>Вимоги:</Title>
                      <Paragraph>{vacancy.requirements}</Paragraph>
                      
                      <Button
                        type="primary"
                        onClick={() => setSelectedVacancy(vacancy)}
                        style={{ marginTop: '20px' }}
                      >
                        Відгукнутися
                      </Button>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Col>

            {selectedVacancy && (
              <Col xs={24} lg={12}>
                <Card title={`Відгук на вакансію: ${selectedVacancy.job_title}`}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitApplication}
                  >
                    <Form.Item
                      name="name"
                      label="Ваше імʼя"
                      rules={[{ required: true, message: 'Будь ласка, введіть ваше імʼя' }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Введите ваше имя"
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Телефон"
                      rules={[
                        { required: true, message: 'Будь ласка, введіть ваш телефон' },
                        { pattern: /^\+?[\d\s()-]+$/, message: 'Введіть коректний номер телефону' }
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="+38 (067) 123-45-67"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Будь ласка, введіть ваш email' },
                        { type: 'email', message: 'Введіть коректний email' }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="your@email.com"
                      />
                    </Form.Item>

                    <Form.Item
                      name="resume_link"
                      label="Посилання на резюме (необовʼязково)"
                    >
                      <Input
                        placeholder="https://hh.ru/resume/..."
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        icon={<SendOutlined />}
                        block
                      >
                        Надіслати заявку
                      </Button>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        onClick={() => {
                          setSelectedVacancy(null);
                          form.resetFields();
                        }}
                        block
                      >
                        Скасувати
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Vacancies;