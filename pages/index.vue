<template>
  <div>
    <a-spin v-if="!init || showLoading" :tip="tip" style="width: 100%; position: fixed; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); z-index: 999999; background-color: rgba(255, 255, 255, 0.45);">
      <div style="height: 100vh;" />
    </a-spin>
    <div v-if="init">
      <div class="header" :style="{
        left: `${-offsetLeft}px`,
        backgroundColor: offsetTop > 0 ? 'rgba(255, 255, 255, 0.65)' : ''
      }">
        <Logo />
        <Wallet class="select-wallet-mobile" @click="() => {setAccount(account)}" :spinning="spinning" :account="account" :balance="balance" :award="award" @connectWallet="connectWallet" @receive="receive" @exchange="exchange" />
        <div class="links">
          <EtherScan :address="address" />
          <!-- <Twitter :twitter="twitter" /> -->
        </div>
      </div>
      <div class="top">
        <a-tabs :default-active-key="0.01">
          <Wallet class="select-wallet" slot="tabBarExtraContent" @click="() => {setAccount(account)}" :spinning="spinning" :account="account" :balance="balance" :award="award" @connectWallet="connectWallet" @receive="receive" @exchange="exchange" />
          <a-tab-pane v-for="type of types" :key="type" :tab="`${type} ETH`">
            <div>
              <div>
                玩法： {{ type }} ETH
              </div>
              <div>
                进度 <a-tag color="blue" v-if="periods[type].code === 100">等待开奖</a-tag>
                <a-tag :color="syncTime === 0 ? 'orange' : 'green'" style="float: right;">
                  {{ syncTime === 0 ? '同步中...' : '同步时间 : ' + syncTime + ' 秒前' }}
                </a-tag>
                <a-progress :percent="periods[type].code" />
                <a-button :type="periods[type].code === 100 ? 'danger' : 'primary'" style="float: right; margin-top: 20px;" :disabled="account === undefined" @click="buy(type)">
                  {{ periods[type].code === 100 ? '开奖' : '购彩' }}
                </a-button>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="main">
        <a-collapse default-active-key="1" :bordered="false">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel key="1" header="玩法介绍">
            <p>以太乐透是一款100选1的乐透型彩票 每期100张彩票 每期彩票销售完成后 将在下一期彩票售出第一张时 自动触发本期开奖 不同金额玩法的奖金独立发放</p>
            <p>本彩票不记名 若彩票获奖 持有当前获奖彩票即可兑奖 兑奖后彩票失效</p>
            <p>编号1的创建者自动触发上一期的开奖 所以开奖后获得10%的上一期销售额奖励</p>
            <p>当期销售额的10%为手续费 剩余80%当期销售额为当期奖金</p>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="奖项说明">
            <p>每期彩票100%开出奖项 奖金总额为当期销售额的80%</p>
            <p>若当期开出多个相同号码 则奖金平分</p>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="是否有暗箱操作">
            <p>以太乐透的智能合约开源并验证 所有源代码公开 任何人包括合约所有者都无法操控开奖号码 也不存在跑路 公平公正公开</p>
          </a-collapse-panel>
          <a-collapse-panel key="4" header="如何购买">
            <p>以太乐透支持多种金额的玩法 在当前页面选择金额后 点击下方 [购买] 按钮 输入自己想要的号码 即可购买</p>
          </a-collapse-panel>
          <a-collapse-panel key="5" header="开奖算法">
            <p>为了公平公正 开奖的算法很简单 就是当期所有购买者 在开奖时的钱包余额数字拼接后 生成 [keccak] 值</p>
          </a-collapse-panel>
          <a-collapse-panel key="6" header="如何查看是否开奖">
            <p>可以在任意的 NFT 市场中 直接刷新 [matedata] 进行查看是否开奖</p>
          </a-collapse-panel>
          <a-collapse-panel key="7" header="如何查看自己是否中奖">
            <p>开奖后可以在任意的 NFT 市场中 直接刷新 [matedata] 进行查看是否中奖</p>
          </a-collapse-panel>
          <a-collapse-panel key="8" header="如何兑奖">
            <p>在当前页面的 [我的钱包] 中 点击 [彩票兑奖] 输入 [彩票编码] 即可兑奖</p>
          </a-collapse-panel>
          <a-collapse-panel key="9" header="如何领取自己的奖励">
            <p>在当前页面的 [我的钱包] 中 点击 [领取奖励] 即可领取</p>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <a-modal v-model="showBuy" :maskClosable="false" centered title="购买彩票" cancelText="取消" okText="购买" @ok="buyLottery" @cancel="number = undefined">
      <a-form>
        <a-form-item
          label="玩法类型"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          {{ playType }} ETH
        </a-form-item>
        <a-form-item
          label="彩票号码"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input-number v-model="number" autoFocus :min="1" :max="100" /> <a-tag color="blue" style="margin-left: 20px;">1 - 100</a-tag>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="showReceive" :maskClosable="false" centered title="领取奖励" cancelText="取消" okText="领取" @ok="receiveAward">
      <a-form>
        <a-form-item
          label="未领奖励"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          {{ award || 0 }} ETH
        </a-form-item>
        <a-form-item
          label="接收地址"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input v-model="receiveAddress"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="showExchange" :maskClosable="false" centered title="彩票兑奖" cancelText="取消" okText="兑奖" @ok="exchangeLottery" @cancel="tokenId = undefined">
      <a-form>
        <a-form-item
          label="彩票编号"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input-number v-model="tokenId" autoFocus :min="1" /> <a-tag color="blue" style="margin-left: 20px;">Token ID</a-tag>
        </a-form-item>
        <a-form-item
          label="接收地址"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input v-model="exchangeAddress"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import * as ethers from 'ethers'
import Logo from '@/components/logo'
import EtherScan from '@/components/etherscan'
// import Twitter from '@/components/twitter'
import Wallet from '@/components/wallet/index.vue'
import EtherLotto from '@/assets/contract/EtherLotto.json'

export default {
  name: 'Index',
  components: {
    Logo,
    EtherScan,
    // Twitter,
    Wallet
  },
  data () {
    return {
      offsetTop: 0,
      offsetLeft: 0,
      types: [0.001, 0.01, 0.1, 1, 10, 100, 1000],
      periods: {},
      syncTime: 1,
      timeInterval: undefined,
      tip: '初始化中...',
      init: false,
      address: '0x9B2a337216636fcEB3E66054fb471eF553cdf21a',
      // twitter: '',
      provider: undefined,
      contract: undefined,
      spinning: false,
      account: undefined,
      balance: undefined,
      award: undefined,
      showLoading: false,
      showBuy: false,
      playType: undefined,
      number: undefined,
      showReceive: false,
      receiveAddress: undefined,
      showExchange: false,
      tokenId: undefined,
      exchangeAddress: undefined
    }
  },
  created () {
    this.types.map(item => {
      this.periods[item] = {
        id: 0,
        code: 0
      }
    })
  },
  async mounted () {
    document.onscroll = () => {
      if (window.pageYOffset !== undefined) {
        this.offsetTop = window.pageYOffset
        this.offsetLeft = window.pageXOffset
      } else {
        this.offsetTop = document.body.scrollLeft + document.documentElement.scrollLeft
        this.offsetLeft = document.body.scrollTop + document.documentElement.scrollTop
      }
    }

    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum, 1)
      this.contract = new ethers.Contract(this.address, EtherLotto.abi, this.provider.getSigner())
      try {
        this.getPeriodCode()
      } catch (error) {}
      this.init = true
    } catch (error) {
      this.$warning({
        title: '初始化错误',
        centered: true,
        content: '未找到钱包提供者',
        okText: '立即下载',
        zIndex: 9999999,
        onOk: () => {
          this.tip = '下载完成后请刷新页面'
          this.downLoadMetaMask()
        }
      })
    }
  },
  methods: {
    async getPeriodCode () {
      if (this.timeInterval) {
        clearInterval(this.timeInterval)
      }
      this.syncTime = 0
      for (let i = 0; i < this.types.length; i++) {
        const period = await this.contract.periods(ethers.utils.parseEther(`${this.types[i]}`))
        this.periods[this.types[i]] = {
          id: period.id,
          code: Number.parseInt(period.code)
        }
      }
      this.setSyncTime()
      setTimeout(() => {
        this.getPeriodCode()
      }, 100000)
    },
    setSyncTime () {
      this.syncTime = 1
      this.timeInterval = setInterval(() => {
        this.syncTime += 1
      }, 1000)
    },
    connectWallet (type) {
      this.spinning = true
      switch (type) {
        case 'matemask':
          this.connectMateMask()
          break
      }
    },
    connectMateMask () {
      this.provider.send('eth_requestAccounts', []).then(async accounts => {
        if (accounts.length > 0) {
          await this.setAccount(accounts[0])
          this.receiveAddress = accounts[0]
          this.exchangeAddress = accounts[0]
          await this.getPeriodCode()
        } else {
          this.$notification.error({
            duration: 5,
            message: '错误',
            description: '钱包中没有账户'
          })
        }
        this.spinning = false
      }).catch(() => {
        this.spinning = false
        this.$notification.error({
          duration: 5,
          message: '错误',
          description: '用户取消授权'
        })
      })
    },
    setAccount (address) {
      if (address) {
        return new Promise(async(resolve, reject) => {
          this.account = address
          this.balance = ethers.utils.formatEther(await this.provider.getBalance(address))
          this.award = ethers.utils.formatEther(await this.contract.awards(address))
          resolve()
        })
      }
    },
    downLoadMetaMask () {
      window.open('https://metamask.io/download/')
    },
    buy (type) {
      this.playType = type
      this.showBuy = true
    },
    buyLottery () {
      if (this.number) {
        this.showLoading = true
        this.tip = `购买彩票中 [ 玩法 : ${this.playType} ETH ] [ 号码 : ${this.number} ] 祝好运`
        this.contract.buyLottery(this.number, {
          value: ethers.utils.parseEther(`${this.playType}`)
        }).then(async result => {
          await this.setAccount(this.account)
          this.$notification.success({
            duration: 5,
            message: '成功',
            description: '购买彩票成功'
          })
          this.showBuy = false
          this.number = undefined
          this.showLoading = false
          setTimeout(() => {
            this.getPeriodCode()
          }, 3000)
        }).catch(error => {
          this.$notification.warning({
            duration: 5,
            message: '提示',
            description: '用户取消购买或无法购买'
          })
          this.showLoading = false
        })
      } else {
        this.$notification.warning({
          duration: 5,
          message: '提示',
          description: '请输入彩票号码'
        })
      }
    },
    receive () {
      this.showReceive = true
    },
    receiveAward () {
      this.showLoading = true
      this.tip = '领取中...'
      this.contract.receiveAward(this.receiveAddress).then(result => {
        this.balance = `${Number.parseFloat(this.balance) + Number.parseFloat(this.award)}`
        this.award = '0.0'
        this.$notification.success({
          duration: 5,
          message: '成功',
          description: '领取奖励成功'
        })
        this.showReceive = false
        this.showLoading = false
      }).catch(error => {
        this.$notification.warning({
          duration: 5,
          message: '提示',
          description: '用户取消领取奖励或无法领取'
        })
        this.showLoading = false
      })
    },
    exchange () {
      this.showExchange = true
    },
    exchangeLottery () {
      if (this.tokenId) {
        this.showLoading = true
        this.tip = '兑奖中...'
        this.contract.redeem(this.tokenId, this.exchangeAddress).then(async result => {
          await this.setAccount(this.account)
          this.$notification.success({
            duration: 5,
            message: '成功',
            description: '彩票兑奖成功'
          })
          this.showExchange = false
          this.tokenId = undefined
          this.showLoading = false
        }).catch(error => {
          this.$notification.warning({
            duration: 5,
            message: '提示',
            description: '用户取消彩票兑奖或无法兑奖'
          })
          this.showLoading = false
        })
      } else {
        this.$notification.warning({
          duration: 5,
          message: '提示',
          description: '请输入彩票编号'
        })
      }
    }
  }
}
</script>
