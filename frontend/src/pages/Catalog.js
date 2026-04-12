import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Button, Typography, Spin, Empty } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import catalogService from '../services/catalogService';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        catalogService.getCategories(),
        catalogService.getProducts()
      ]);

      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPriceList = async (categoryId = null) => {
    try {
      const response = await catalogService.downloadPriceList(categoryId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'price_list.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading price list:', error);
    }
  };

  const getProductsByCategory = (categoryId) => {
    if (categoryId === 'all') return products;
    return products.filter(product => product.category_id === categoryId);
  };

  const renderProducts = (categoryId) => {
    const filteredProducts = getProductsByCategory(categoryId);
    
    if (filteredProducts.length === 0) {
      return <Empty description="Товари не знайдені" />;
    }

    return (
      <Row gutter={[24, 24]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card className="product-card" hoverable>
              <div className="product-name">{product.name}</div>
              <div className="product-weight">{product.weight_packaging}</div>
              <div className="product-price">{product.price.toLocaleString()} ₴</div>
            </Card>
          </Col>
        ))}
      </Row>
    );
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
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ color: '#2c3e50' }}>
            Продукція
          </Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#7f8c8d', marginBottom: '30px' }}>
            Якісна продукція від виробника
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            onClick={() => downloadPriceList()}
            className="download-button"
          >
            Завантажити повний прайс-лист
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
          <TabPane tab="Усі товари" key="all">
            {renderProducts('all')}
          </TabPane>
          {categories.map((category) => (
            <TabPane tab={category.name} key={category.id}>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Button
                  type="default"
                  icon={<DownloadOutlined />}
                  onClick={() => downloadPriceList(category.id)}
                >
                  Завантажити прайс-лист категорії
                </Button>
              </div>
              {renderProducts(category.id)}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Catalog;