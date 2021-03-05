<template>
	<div class="ellipsis-wrapper" :style="style">
		<a-tooltip placement="topLeft" v-if="tooltip" :title="title">
			<div class="ellipsis-content">
				<slot></slot>
			</div>
		</a-tooltip>
		<div class="ellipsis-content-normal" v-else>
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name:'Ellipsis',
		props:{
			width:{
				type:Number,
				default:0,
			},
			title:{
				type:String,
				default:'',
			}
		},
		computed:{
			style(){
				return {
					width: this.width === 0 ? 'auto' : `${this.width}px`,
					maxWidth:this.width,
				}
			},
			tooltip(){
				return this.width ? this.title.length * 7 > this.width : false;
			}
		}
	}
</script>

<style scoped lang="scss">
.ellipsis-wrapper{
	.ellipsis-content{
		width: 100%;
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	.ellipsis-content-normal{
		width: 100%;
		overflow: hidden;
	}
}
</style>
