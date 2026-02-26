import React from 'react';
import { Row, Col, Typography, Card, Divider } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Contacts = () => {
  const contactInfo = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: '2rem', color: '#e74c3c' }} />,
      title: 'Адреса виробництва',
      content: 'м. Київ, вул. Промислова, 15',
    },
    {
      icon: <PhoneOutlined style={{ fontSize: '2rem', color: '#e74c3c' }} />,
      title: 'Телефон',
      content: '+38 (044) 123-45-67',
      action: 'tel:+380441234567',
    },
    {
      icon: <MailOutlined style={{ fontSize: '2rem', color: '#e74c3c' }} />,
      title: 'Email',
      content: 'info@aldar-zs.ua',
      action: 'mailto:info@aldar-zs.ua',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '2rem', color: '#e74c3c' }} />,
      title: 'Сайт',
      content: 'www.aldar-zs.ua',
      action: 'https://www.aldar-zs.ua',
    },
  ];

  const messengers = [
    {
      name: 'Telegram',
      username: '@aldar_zs',
      icon: '💬',
      color: '#0088cc',
    },
    {
      name: 'WhatsApp',
      username: '+38 067 123-45-67',
      icon: '📱',
      color: '#25d366',
    },
    {
      name: 'Viber',
      username: '+38 067 123-45-67',
      icon: '💬',
      color: '#7360f2',
    },
  ];

  const workHours = [
    { day: 'Понеділок - Пʼятниця', hours: '08:00 - 18:00' },
    { day: 'Субота', hours: '09:00 - 15:00' },
    { day: 'Неділя', hours: 'Вихідний' },
  ];

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={2} style={{ color: '#2c3e50' }}>
            Контакти
          </Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
            Звʼяжіться з нами зручним для вас способом
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Основна інформація" style={{ height: '100%' }}>
              <div className="contact-info">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-item">
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ marginRight: '15px', minWidth: '60px', textAlign: 'center' }}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="contact-label">{item.title}</div>
                        <div className="contact-value">
                          {item.action ? (
                            <a href={item.action} style={{ color: '#7f8c8d', textDecoration: 'none' }}>
                              {item.content}
                            </a>
                          ) : (
                            item.content
                          )}
                        </div>
                      </div>
                    </div>
                    {index < contactInfo.length - 1 && <Divider />}
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Card title="Месенджери">
                  {messengers.map((messenger, index) => (
                    <div key={index} style={{ 
                      marginBottom: '15px', 
                      padding: '15px', 
                      border: '1px solid #f0f0f0', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>
                          {messenger.icon}
                        </span>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                            {messenger.name}
                          </div>
                          <div style={{ color: '#7f8c8d' }}>
                            {messenger.username}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: messenger.color,
                        }}
                      />
                    </div>
                  ))}
                </Card>
              </Col>

              <Col xs={24}>
                <Card title="Графік роботи">
                  {workHours.map((schedule, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '10px',
                      padding: '10px 0'
                    }}>
                      <span style={{ color: '#2c3e50' }}>{schedule.day}</span>
                      <span style={{ 
                        color: schedule.hours === 'Вихідний' ? '#e74c3c' : '#27ae60',
                        fontWeight: 'bold'
                      }}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ marginTop: '40px' }}>
          <Col span={24}>
            <Card title="Як нас знайти">
              <div style={{ 
                height: '400px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7f8c8d'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: '3rem', marginBottom: '10px' }} />
                  <div>Інтерактивна карта</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                    Тут буде відображено карту з місцезнаходженням виробництва
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Contacts;