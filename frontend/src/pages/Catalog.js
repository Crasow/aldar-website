import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Button, Typography, Spin, Empty } from 'antd';
import {DownloadOutlined} from "@ant-design/icons";
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
        fetch('/api/categories'),
        fetch('/api/products')
      ]);

      const categoriesData = await categoriesResponse.json();
      const productsData = await productsResponse.json();

      setCategories(categoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPriceList = async (categoryId = null) => {
    try {
      const url = categoryId 
        ? `/api/price-list/download?category_id=${categoryId}`
        : '/api/price-list/download';
      
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'price_list.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      }
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
      return <Empty description="Товары не найдены" />;
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
            Продукция
          </Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#7f8c8d', marginBottom: '30px' }}>
            Качественная продукция от производителя
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            onClick={() => downloadPriceList()}
            className="download-button"
          >
            Скачать полный прайс-лист
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
          <TabPane tab="Все товары" key="all">
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
                  Скачать прайс-лист категории
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