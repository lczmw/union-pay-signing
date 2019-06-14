<template>
	<div class="sort-page c-flex-page">
		<header>
	      <van-nav-bar :title="title" :left-arrow="canBack" @click-left="onClickLeft"/>
	    </header>
		
		<div class="van-search__inner" v-if="type ==='1'">
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
			finished-text="没有更多数据了"
  			@load="onLoad"
  			
  			class="c-flex-content"
		>
			<div class="sign-item" 
				v-for="(item, index) in list"
				@click="handleSignItemClick(item)"
			>
				<div class="sign-item__header" v-if="type === '1'" @click.stop>
					<div class="sign-item__header-item is-auto">
						<div class="sign-item__header-key">银豹账号</div>
						<div class="sign-item__header-value ellipsis">{{ item.pospal_account }}</div>
					</div>
					
				
					<div class="sign-item__header-item" @click="handleRadioClick(item)" v-if="item.apply_status_msg === '入网成功'">
						<div v-show="item.config_status_done === false">
							<van-loading type="spinner" size="20px"></van-loading>
						</div>
						<div class="sign-item__row-key">是否配置</div>
						<div class="sign-item__row-value">
							<van-radio-group v-model="item.config_status" disabled>
							  <van-radio :name="1"></van-radio>
							</van-radio-group>
						</div>
						
				
					</div>
					
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



		<div class="c-float-btn" v-if="type === '2'" @click="addSign">
			<div class="c-float-btn__inner">
				<img src="@/assect/img/add_02@3x.png" class="c-float-btn__icon">
				<span class="c-float-btn__text">
					新增签约
				</span>
			</div>
		</div>

		<div class="c-float-btn" v-if="type === '1'" @click="exportRecord">
			<div class="c-float-btn__inner">
				<span class="c-float-btn__text">
					导出记录
				</span>
				<img src="@/assect/img/upload.png" class="upload__icon">
			</div>
		</div>


		  <van-popup 
		      v-model="popShow1"
		      position="bottom"
		    >
		      <div class="popup-inner">
		     
		          <van-cell-group>
		            <van-cell
		              v-for="(item, index) in columns1"
		              clickable
		              :key="index"
		              :title="item.name"
		              @click="handlePopItemClick(item)"
		            >
		           	
		            </van-cell>
		          </van-cell-group>
		      
		      </div>

		      
		    </van-popup>
	</div>
</template>

<script>
import { QuerySignRecords, NewSign, UpdateConfigStatu, Export } from '@/api'
import { List, Search, Radio, RadioGroup, Loading } from 'vant';
import Cookies from 'js-cookie'
export default {
	components: {
		VanList: List,
		VanSearch: Search,
		VanRadio: Radio,
		VanRadioGroup: RadioGroup,
		VanLoading: Loading,
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
			title: '',

			radio: [],
			popShow1: false,
			columns1: [{
				name: '导出未配置',
				status: 0,
			},{
				name: '导出已配置',
				status: 1,
			}]
		}
	},

	computed: {
		type() {
			return this.$route.query.type || '1'
		}
	},

	methods: {
		handleRadioClick(item) {
			item.config_status_done = false;
			
			let status = item.config_status === 0 ? 1 : 0;
			UpdateConfigStatu({
				sign_id: item.id,
				config_status: status
			})
			.then(({ result }) => {
				item.config_status = result.config_status
			})
			.catch(() => {

			})
			.finally(() => {
				item.config_status_done = true;
			})
	
		},
		handlePopItemClick({ status }) {
			if (!window.location.origin) {
			  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
			}
			window.location = `${window.location.origin}/wxapi/UnionPaySigning/Export?config_status=${ status }`;
			// window.open(`${window.location.origin}/wxapi/UnionPaySigning/Export?config_status=${ status }`, '_blank');
		},
		addSign() {
			NewSign({
				pospal_account: Cookies.get('account')
			})
			.then(({ result }) => {
				Cookies.set('sign_id', result.id)
				this.$router.push('/home')
			})
			.catch(() => {

			})
		},
		onLoad() {
			this.loadData();
		},
		loadData() {
			this.loading = true;
			let params = this.getParams();
			QuerySignRecords(params)
			.then(({ result }) => {
				this.loading = false;
				if (result.length === 0 || this.type === '2') {
					this.finished = true;
				}
				this.pageIndex += 1;
				result.forEach((item) => {
					item.config_status_done = true;
				})
				this.list.push(...result)
			})
		},
		toggle(name) {
	      return (index) => {
	        this.$refs[name][index].toggle();
	      }
	    },
		getParams() {
			let map = {
				'1': {
					pageIndex: this.pageIndex,
					pageSize: this.pageSize,
					key: this.key,
				},
				'2': {
					pospal_account: Cookies.get('account')
				}
			}
			return map[this.type]
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
			this.loadData();
		},
		onClear() {
			this.initQuery();
			this.loadData();
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
		handleSignItemClick({ id }) {
			Cookies.set('sign_id', id)
			this.$router.push('/home')
		},
		exportRecord() {
			this.popShow1 = true;
		},
	},

	created () {

	},

	mounted() {
		let account = Cookies.get('account');

		if (this.type === '1') {
			this.title = '签约列表'
			document.title = '签约列表'
		}else if (this.type === '2') {
			let title = `${account}的签约列表`
			this.title = title
			document.title = title
		}
	}
}
</script>

<style  lang="less" scoped>
	.sort-page{
		height: 100%;background-color: #f8f8f8;overflow: hidden;
	}
	.sign-list{
		height: calc(100% - 98px); overflow: auto;
	}
	.sign-item__header-item{
		display: flex;
	    align-items: center;
	    flex: none;
	    &.is-auto{
	    	flex: auto;
	    	min-width: 0;
	    }
	}
	.sign-item{
		margin-bottom: 8px;background-color: #fff;
	}
	.sign-item__header{
		display: flex;
	    align-items: center;
		justify-content: space-between;
	    height: 54px;
	    border-bottom: 1px solid #f2f2f2;
	    padding: 0 15px;
	}
	.sign-item__header-key{
		flex: none;
		color: #353535;
    	font-weight: 600;
    	font-size: 15px;
    	margin-right: 15px;
	}
	.sign-item__header-value{
	    font-size: 15px;
		color: #353535;
		flex: auto;
	}
	.sign-item__content{
		padding: 10px 15px;
	}
	.sign-item__row{
		display: flex;    
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
	.sign-item__footer{
		padding: 0 15px;
		.sign-item__row{
			align-items: center
		}
	}

.van-search__inner{
		margin-bottom: 1px;
	}

	.upload__icon{
		width: 20px;
		height: 18px;
		vertical-align: middle;
	}
</style>

<style type="text/css">

	
	.van-radio__icon--disabled .van-icon{
		border-color: #e5e5e5;
		background-color: transparent;
	}

	.van-radio__icon--disabled.van-radio__icon--checked .van-icon{
		    border-color: #1A76E0;
    	background-color: #1A76E0;
    	color: #fff;
	}
</style>
