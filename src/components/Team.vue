<template lang="pug">
  .p-1(v-if="team !== null")
    img(v-bind:src="`https://cdn2.rebbl.net/images/races/${team.team.idraces}.png`" style="height:40px")
    span.text-info {{team.team.name}}
    img(v-bind:src="`https://cdn2.rebbl.net/images/logo/256x256/logo_${team.team.logo.toLowerCase()}.png`" style="height:40px")
    br
    span.badge.badge-warning.mx-1  {{team.coach.name}}
    span.badge.badge-info.mx-1 TV: {{team.team.nextMatchTV || team.team.value}}

</template>

<script>
  export default {
    props:["reddit", "team"]
  }
</script>