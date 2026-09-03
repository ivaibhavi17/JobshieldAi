import Icon from '../ui/Icon'

function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner">
      <Icon name="info-circle" size={18} className="disclaimer-banner__icon" />
      <p><strong>Disclaimer.</strong> JobShield AI provides an AI-assisted preliminary risk assessment. It may produce false positives or false negatives. Always independently verify an employer before taking action.</p>
    </div>
  )
}

export default DisclaimerBanner
