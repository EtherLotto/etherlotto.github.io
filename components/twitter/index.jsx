import './index.scss';

export default {
  name: 'Twitter',
  props: {
    twitter: {
      type: String,
      require: true
    }
  },
  render () {
    return (
      <a class="twitter" target="_blank" href={`https://twitter.com/${this.twitter}`}>
        <div>
          <img src={require('@/assets/images/twitter.svg')} alt="Twitter" />
        </div>
      </a>
    )
  }
}
