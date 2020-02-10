<template>
  <button class="btn btn-outline-info btn-sm m-1" type="button">
      {{power}} 
      <span class="badge badge-secondary">{{left}}</span>
  </button>
</template>

<script>
	export default {
		props:["power", "left","description"]
	};


</script>

<style  scoped>

</style>

