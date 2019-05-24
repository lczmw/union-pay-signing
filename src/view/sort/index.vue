<template>
	<div class="sort-page">
		
		<div class="sort-page__inner">
			<div class="sort-page__title">
				银联自助签约
			</div>
			<div 
				class="sort-item" 
				v-for="(item, index) in sortList"
				:key="index"
			>
				<cell :title="item.title" is-link class="sort-item__cell" @click="handleCellClick(item)"/>
			</div>

		</div>
		
	</div>
</template>

<script>
import { Cell } from 'vant';
export default {
	components: {
		Cell
	},
	data () {
		return {
			sortList: [
				{ title: '签约列表', path: '/signlist' },
				{ title: '自助签约', path: '/info?from=1' },
			]
		}
	},

	methods: {
		handleCellClick({ path }) {
			this.$router.push(path)
		}
	},

	created () {

	},
}
</script>

<style lang="less" scoped>
	.sort-page{
		height: 100%;background-color: #f8f8f8;
	}
	.sort-page__inner{
		box-sizing: border-box;
	    width: 100%;
	    padding: 64px 20px 20px;
	}
	.sort-item{
		margin-bottom: 16px;
	}
	.sort-item__cell{
		align-items: center;
	    font-weight: 500;
	    font-size: 16px;
	    line-height: 40px;
	    border-radius: 2px;
	}
	.van-cell--clickable:active{
		background-color: #f2f3f5;
	}
	.sort-page__title{
		margin-bottom:30px;
		font-weight: normal;
		user-select: none;
		font-size: 30px;
	}
</style>