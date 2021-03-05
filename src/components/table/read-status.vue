<template>
	<div>
		<a-badge :dot="dot" class="dot-badge-only"></a-badge>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name:'ReadStatus',
		props:{
			dot:{
				type:Boolean,
				default:false,
			}
		}
	}
</script>

<style scoped>

</style>
