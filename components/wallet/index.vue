<template>
  <div>
    <div class="wallet" @click="() => {visible = true, $emit('click')}">
      <img :src="wallet" alt="Wallet" />
    </div>
    <a-drawer placement="right" wrapClassName="link-wallet" :maskClosable="false" :visible="visible" @close="visible = false">
      <div slot="title">
        <span class="title" v-if="account === undefined">
          <a-icon type="global" /> 连接钱包
        </span>
        <span v-else>
          <a-icon type="user" /> 我的钱包
        </span>
      </div>
      <div class="tip">
        <span v-if="account === undefined">如果没有钱包 可以选择一个钱包提供者创建一个</span>
        <span v-else>Ethereum: {{ account.slice(0, -30) }}...{{ account.slice(-10) }}</span>
      </div>
      <a-spin v-if="account === undefined" :spinning="spinning" :indicator="indicator">
        <a-list class="wallet-list" bordered>
          <a-list-item @click="connectWallet('matemask')">
            MateMask <a-tag color="green">推荐</a-tag>
            <img class="right" :src="require('@/assets/images/metamask.svg')" />
          </a-list-item>
          <!-- <a-list-item>
            WalletConnect
            <img class="right" :src="require('@/assets/images/walletconnect.svg')" />
          </a-list-item>
          <a-list-item>
            Coinbase Wallet
            <img class="right" style="border-radius: 24px;" :src="require('@/assets/images/coinbase.svg')" />
          </a-list-item> -->
        </a-list>
      </a-spin>
      <a-list v-else class="wallet-list" bordered>
        <a-list-item>
          余额<span class="right">{{ balance?.slice(0, -10) || 0 }} ETH</span>
        </a-list-item>
        <a-list-item>
          奖励<span class="right">{{ award || 0 }} ETH</span>
        </a-list-item>
      </a-list>
      <a-row v-if="account !== undefined">
        <a-col :span="8" class="link-button" @click="receive">
          <img :src="require('@/assets/images/receive.svg')" />
          <div>领取奖励</div>
        </a-col>
        <a-col :span="8" class="link-button" @click="opensea">
          <img :src="require('@/assets/images/check.svg')" />
          <div>查看彩票</div>
        </a-col>
        <a-col :span="8" class="link-button" @click="exchange">
          <img :src="require('@/assets/images/exchange.svg')" />
          <div>彩票兑奖</div>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'Wallet',
  props: {
    spinning: {
      type: Boolean,
      default: false
    },
    account: {
      type: String,
      require: true 
    },
    balance: {
      type: String,
      require: true 
    },
    award: {
      type: String,
      require: true 
    }
  },
  data () {
    return {
      wallet: require('@/assets/images/wallet.svg'),
      visible: false,
      indicator: <a-icon type="loading" style="font-size: 24px" spin />
    }
  },
  methods: {
    connectWallet (type) {
      this.$emit('connectWallet', type)
    },
    receive () {
      if (Number.parseFloat(this.award) > 0) {
        this.$emit('receive')
      } else {
        this.$notification.warning({
          duration: 2,
          message: '提示',
          description: '没有可领取的奖励'
        })
      }
    },
    opensea () {
      window.open(`https://opensea.io/${this.account}?search[query]=Ether Lotto`)
    },
    exchange () {
      this.$emit('exchange')
    }
  }
}
</script>

<style lang="scss">
.wallet {
  display: inline-block;
  width: 32px;
  height: 32px;
}

.link-wallet {
  .title {
    font-weight: bold;
  }

  .tip {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 24px;
  }
  
  .wallet-list {

    .ant-list-item {
      cursor: pointer;
      font-weight: 800;

      .right {
        height: 24px;
        float: right;
      }
    }
  }

  .link-button {
    text-align: center;
    margin-top: 40px;

    img {
      cursor: pointer;
      width: 50%!important;
    }

    div {
      cursor: pointer;
      margin-top: 10px;
      font-weight: bold;
    }
  }
}
</style>