<template>
  <div>
    <template v-for="power in Object.keys(powers)">
      <template v-for="i in powers[power]">
        <power v-bind:key="power+i"
          v-bind:power="descriptions.find(function(x){return x.key == power}).name"
          v-bind:description="descriptions.find(function(x){return x.key == power}).description"
        >
        </power>
      </template>
    </template>
  </div>
</template>

<script>

import Power from "./Power.vue";
export default {
  components: { Power },
  props:["powers", "descriptions"],
};
</script>

<style>

</style>
