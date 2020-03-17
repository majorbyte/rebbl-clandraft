<template>
  <div>
    <template v-for="power in Object.keys(powers)">
      <template v-for="i in powers[power]">
        <button class="btn btn-outline-info btn-sm m-1" type="button" v-bind:key="power+i" @click="cb({power,home})">
          {{powerName(power)}} 
        </button>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters ,mapState } from 'vuex'

export default {
  props:["powers","home", "cb"],
  computed: mapState({
    ...mapGetters('powers',['powerName'])
  })
};
</script>

<style>

</style>
