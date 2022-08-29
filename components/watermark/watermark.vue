<template>
	<zmm-watermark :opacity="0.05" :watermark="watermark"></zmm-watermark>
</template>

<script>
export default {
	name: 'watermark',
	data() {
		return {};
	},
	computed: {
		watermark() {
			return this.$store.state.watermark;
		}
	}
};
</script>

<style scoped lang="scss">
</style>
