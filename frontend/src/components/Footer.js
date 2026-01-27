import React from 'react';
import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer>
      <Row justify="center" align="middle">
        <Col span={24}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              © 2026 ALDAR ZS. Все права защищены.
            </p>
            <p style={{ margin: '10px 0 0 0', color: '#bdc3c7' }}>
              Мясокомбинат высокого качества
            </p>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;