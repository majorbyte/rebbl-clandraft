<template >
  <div class="p-1" v-if="team !== null">
    <img v-bind:src="`https://cdn2.rebbl.net/images/races/${team.team.idraces}.png`" style="height:40px" />
    <span class="text-info">{{team.team.name}}</span>
    <img v-bind:src="`https://cdn2.rebbl.net/images/logo/256x256/logo_${team.team.logo.toLowerCase()}.png`" style="height:40px" />
    <br>
    <span class="badge badge-success"> /u/{{reddit}}</span>
    <span class="badge badge-warning"> {{team.coach.name}}</span>
    <span class="badge badge-info">TV: {{team.team.nextMatchTV || team.team.value}}</span>
  </div>
</template>

<script>
  export default {
    props:["reddit", "team"]
  }
</script>