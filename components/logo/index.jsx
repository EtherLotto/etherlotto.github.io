import './index.scss';

export default {
  name: 'Logo',
  data () {
    return {
      logo: require('@/assets/images/logo.svg')
    }
  },
  render () {
    return (
      <div class="logo">
        <img src={this.logo} alt="Ether Lotto" />
      </div>
    )
  }
}
