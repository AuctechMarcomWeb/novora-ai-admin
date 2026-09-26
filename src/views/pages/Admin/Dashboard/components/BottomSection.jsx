/* eslint-disable prettier/prettier */
import { Col, Row }    from 'antd'
import RecentOrders    from './RecentOrders'
import CommissionFlow  from './CommissionFlow'

// ─── Combined ──────────────────────────────────────────────────────────────────
const BottomSection = ({ commFlow }) => (
  <Row gutter={[14, 14]}>
    <Col xs={24} md={12} lg={11}>
      <RecentOrders />
    </Col>
    <Col xs={24} md={12} lg={13}>
      <CommissionFlow flow={commFlow} />
    </Col>
  </Row>
)

export default BottomSection
