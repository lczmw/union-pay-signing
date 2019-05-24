<template>
	<div class="sort-page">
		<header>
	      <van-nav-bar title="签约列表" :left-arrow="canBack" @click-left="onClickLeft"/>
	    </header>
		
		<div class="van-search__inner">
			<van-search 
				placeholder="请输入账号关键字" 
				v-model="key" 
				@search="onSearch"
				@clear="onClear"
			/>
		</div>

		<van-list
			v-model="loading"
			:finished="finished"
			finished-text="没有更多了"
  			@load="onLoad"
  			
  			class="sign-list"
		>
			<div class="sign-item" 
				v-for="(item, index) in list"
				@click="handleSignItemClick(item)"
			>
				<div class="sign-item__header">
					<div class="sign-item__header-lf">银豹账号</div>
					<div class="sign-item__header-rt">{{ item.pospal_account }}</div>
					
				</div>
				<div class="sign-item__content">
					<div class="sign-item__row">
						<div class="sign-item__row-key">法人姓名</div>
						<div class="sign-item__row-value">{{ item.legal_name }}</div>
					</div>
					<div class="sign-item__row">
						<div class="sign-item__row-key">手机号码</div>
						<div class="sign-item__row-value">{{ item.legal_mobile }}</div>
					</div>
					<div class="sign-item__row">
						<div class="sign-item__row-key">签约步骤</div>
						<div class="sign-item__row-value">{{ getStepText(item.sign_step) }}</div>
					</div>
					<div class="sign-item__row">
						<div class="sign-item__row-key">入网状态</div>
						<div class="sign-item__row-value">{{ item.apply_status_msg }}</div>
					</div>
					<div class="sign-item__row" v-if="item.fail_reason !== ''">
						<div class="sign-item__row-key">失败原因</div>
						<div class="sign-item__row-value is-red">{{ item.fail_reason }}</div>
					</div>
				</div>
				
			</div>
		</van-list>
	</div>
</template>

<script>
import { querySignRecords } from '@/api'
import { List, Search } from 'vant';
import Cookies from 'js-cookie'
export default {
	components: {
		VanList: List,
		VanSearch: Search,
	},
	data () {
		return {
			canBack: true,
			list: [],
			loading: false,
			finished: false,
			pageIndex: 1,
			pageSize: 10,
			key: '',
		}
	},

	methods: {
		onLoad() {
			console.log(123)
			querySignRecords({
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				key: this.key,
			})
			.then(({ result }) => {
				this.loading = false;
				if (result.length === 0) {
					this.finished = true;
				}
				this.pageIndex += 1;
				this.list.push(...result)
			})
		},
		initQuery() {
			this.pageIndex = 1;
			this.list = [];
			this.finished = false;
		},
		onClickLeft() {
			if (!this.canBack) return
        		this.$router.go(-1);
		},
		onSearch() {
			this.initQuery();
		},
		onClear() {
			this.initQuery();
		},
		getStepText(step) {
			let stepMap = {
				'0': '基本信息录入',
				'1': '实名信息录入',
				'2': '营业信息录入',
				'3': '银行账号信息录入',
				'4': '对公账号验证',
				'5': '进行签约',
				'6': '资质审核',
			}
			let v = stepMap[step];
			return typeof v !== 'undefined' ? v : ''
		},
		handleSignItemClick({ pospal_account }) {
			Cookies.set('account', pospal_account)
			this.$router.push('/home')
		}
	},

	created () {

	},
}
</script>

<style lang="less" scoped>
	.sort-page{
		height: 100%;background-color: #f8f8f8;overflow: hidden;
	}
	.sign-list{
		height: calc(100% - 98px); overflow: auto;
	}
	.sign-item{
		margin-bottom: 8px;background-color: #fff;
	}
	.sign-item__header{
		display: flex;
	    align-items: center;
	
	    height: 54px;
	    border-bottom: 1px solid #f2f2f2;
	    padding: 0 15px;
	}
	.sign-item__header-lf{
		color: #353535;
    	font-weight: 600;
    	font-size: 15px;
    	margin-right: 15px;
	}
	.sign-item__header-rt{
	    font-size: 15px;
		color: #353535;
	}
	.sign-item__content{
		padding: 10px 15px;
	}
	.sign-item__row{
		display: flex;
    
    	align-items: center;
    
    	padding-bottom: 10px;
	}
	.sign-item__row-key{
	    font-size: 15px;
		color: #757575;
		flex: none;
		margin-right: 15px;
	}
	.sign-item__row-value{
	    font-size: 15px;
		color: #353535;
		&.is-red{
			color: #ff5556;
		}
	}

.van-search__inner{
		margin-bottom: 1px;
	}
</style>
