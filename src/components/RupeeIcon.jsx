/* eslint-disable prettier/prettier */
const RupeeIcon = ({ style, className }) => (
  <span role="img" aria-label="rupee" className={className}
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 3H6v2h2.94c1.09 0 2 .61 2.39 1.5H6v2h5.33C11.09 9.36 10.1 10 8.94 10H6v2l5 6h2.5l-5-6h.44C12.15 12 14 10.15 14 7.88V7.5h.06c.34 0 .6-.06.82-.15L15.5 5h-2V3z"/>
    </svg>
  </span>
)
export default RupeeIcon
