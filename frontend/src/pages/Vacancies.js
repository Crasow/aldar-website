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
      message.error('Ошибка при загрузке вакансий');
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

      message.success('Ваша заявка успешно отправлена!');
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
            Вакансии
          </Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
            Присоединяйтесь к команде профессионалов ALDAR ZS
          </Paragraph>
        </div>

        {vacancies.length === 0 ? (
          <Empty description="На данный момент открытых вакансий нет" />
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
                      <Title level={4}>Описание:</Title>
                      <Paragraph>{vacancy.description}</Paragraph>
                      
                      <Title level={4}>Требования:</Title>
                      <Paragraph>{vacancy.requirements}</Paragraph>
                      
                      <Button
                        type="primary"
                        onClick={() => setSelectedVacancy(vacancy)}
                        style={{ marginTop: '20px' }}
                      >
                        Откликнуться
                      </Button>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Col>

            {selectedVacancy && (
              <Col xs={24} lg={12}>
                <Card title={`Отклик на вакансию: ${selectedVacancy.job_title}`}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitApplication}
                  >
                    <Form.Item
                      name="name"
                      label="Ваше имя"
                      rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
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
                        { required: true, message: 'Пожалуйста, введите ваш телефон' },
                        { pattern: /^\+?[\d\s()-]+$/, message: 'Введите корректный номер телефона' }
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="+7 (777) 123-45-67"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Пожалуйста, введите ваш email' },
                        { type: 'email', message: 'Введите корректный email' }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="your@email.com"
                      />
                    </Form.Item>

                    <Form.Item
                      name="resume_link"
                      label="Ссылка на резюме (необязательно)"
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
                        Отправить заявку
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
                        Отмена
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