import './index.scss';

export default {
  name: 'Etherscan',
  props: {
    address: {
      type: String,
      require: true
    }
  },
  render () {
    return (
      <a class="etherscan" target="_blank" href={`https://etherscan.io/address/${this.address}`}>
        <div>
          <img src={require('@/assets/images/etherscan.svg')} alt="Ether Scan" />
        </div>
      </a>
    )
  }
}
