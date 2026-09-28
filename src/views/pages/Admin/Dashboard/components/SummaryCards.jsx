/* eslint-disable prettier/prettier */
import { Row, Col, Card, Statistic } from 'antd'
import {
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  EyeOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'

const SummaryCards = ({ summary }) => {
  const getIcon = (key) => {
    const iconMap = {
      totalSchools: <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      totalBooks: <BookOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      totalResources: <FileTextOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      totalViews: <EyeOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      totalOrders: <ShoppingCartOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
      activeUsers: <UserOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
    }
    return iconMap[key] || <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
  }

  const getTitle = (key) => {
    const titleMap = {
      totalSchools: 'Total Schools',
      totalBooks: 'Total Books',
      totalResources: 'Total Resources',
      totalViews: 'Total Views',
      totalOrders: 'Total Orders',
      activeUsers: 'Active Users',
    }
    return titleMap[key] || key
  }

  const cards = summary
    ? Object.entries(summary).map(([key, value]) => ({
        key,
        title: getTitle(key),
        value,
        icon: getIcon(key),
      }))
    : []

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => (
        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={card.key}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            <Statistic
              title={card.title}
              value={card.value}
              prefix={card.icon}
              valueStyle={{ fontSize: 20, fontWeight: 600 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default SummaryCards
