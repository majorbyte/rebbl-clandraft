<template lang="pug">
  div
    .container-fluid
      h3 Nested drag elements
      p
        | You have to stopPropagation on the child&apos;s dragstart event, otherwise the parent&apos;s transfer data takes precedence.
      template(v-if='matchup !== null')
        .row
          // available home teams
          .col-3
            drag.drag.col-12(v-for='(team,i) of matchup.home.clan.teams' :key='i' :transfer-data='{team:team}' :class='{ used:used(team.team.id)}')
              team(v-bind:reddit="'test'" v-bind:team='team')
          // Matchups
          .col-6.mx-0.px-0
            .row.col-12.justify-content-center(v-for='(contest,i) of contests' :key='i')
              .col-12.text-center
                h2 Matchup 
              .col
                drop.drop.col-12.px-0(data-home='' :class='{ over }' @dragover='over = true' @dragleave='over = false' @drop='updateContest({contest, team:arguments[0], home:true})')
                  team(v-bind:reddit="'test'" v-bind:team='contest.homeTeam')
              .col
                drop.drop.col-12.px-0(data-away='' :class='{ over }' @dragover='over = true' @dragleave='over = false' @drop='updateContest({contest, team:arguments[0], home:false})')
                  team(v-bind:reddit="'test'" v-bind:team='contest.awayTeam')
          // available away teams
          .col-3
            drag.drag.col-12(v-for='(team,i) of matchup.away.clan.teams' :key='i' :transfer-data='{team:team}' :class='{ used:used(team.team.id)}')
              team(v-bind:reddit="'test'" v-bind:team='team')
        .row.col-12
          .col-6
            powers(:powers='matchup.home.clan.powers' :home='true' :cb='usePower')
            hr
            powers(:powers='usedPowers.home' :home='true' :cb='unusePower')
            button.btn.btn-primary(@click='save') save
          .col-6
            powers(:powers='matchup.away.clan.powers' :home='false' :cb='usePower')
            hr
            powers(:powers='usedPowers.away' :home='false' :cb='unusePower')
            
      template(v-if='showAssassination')
        #assassination.modal.fade(tabindex='-1' role='dialog')
          .modal-dialog.modal-dialog-centered(role='document')
            template(v-if='selectedSide !== null && oppositeSide !== null')
              .modal-content
                .modal-header
                  slot(name='header')
                    h5.modal-title Apply Assassination for {{&grave;[${selectedSide.clan.name}]&grave;}}
                    button.close(type='button' data-dismiss='modal' aria-label='Close')
                      span(aria-hidden='true') &times;
                .modal-body
                  .input-group-prepend
                    span#home.input-group-text Assassinate
                    select.form-control(v-model='selectedTeam' @change='loadPlayersForAssassination()')
                      option(v-for='team in oppositeSide.clan.teams' v-bind:value='team.team.id' v-bind:key='team.team.id') {{ team.team.name }}
                  template(v-if='selectedTeam')
                    .input-group.mb-3
                      .input-group-prepend
                        span#home.input-group-text player
                        select.form-control(v-model='selectedPlayer')
                          option(v-for='player in assPlayers' v-bind:value='player.id' v-bind:key='player.id') {{ player.name }} 
                .modal-footer
                  slot(name='footer')
                    button.btn.btn-secondary(type='button' data-dismiss='modal' @click='reset') Cancel &amp; Close
                    button.btn.btn-primary(type='button' @click='saveAssassination') Use 
</template>

<script>
import { Drag,Drop } from 'vue-drag-drop';
import Team from "./Team.vue";
import Powers from "./Powers.vue";
import { mapActions, mapGetters ,mapState } from 'vuex'

export default {
  components: { Drag, Drop, Powers, Team },
  computed: mapState({
    ...mapGetters('draft',['awayTeam', 'homeTeam', 'used']),
    ...mapGetters('powers',['powerName']),
    matchup: state => state.draft.matchup,
    contests: state => state.draft.contests,
    usedPowers: state => state.draft.usedPowers
  }),
  data: function () {
    return { 
      over: false,
      selectedTeam: null,
      assPlayers:[]
     };
  },  
  methods: {
    ...mapActions('draft', ['updateContest','save','usePower','unusePower']),
    async loadPlayersForAssassination(){
      let result = await fetch(`/api/v2/team/${this.selectedTeam}/players`)
      if(result.ok){
        this.assPlayers = await result.json();
      }
    }, 
  },
  created () {
    this.$store.dispatch('draft/getMatchup');
    this.$store.dispatch('powers/getPowers');
  }
};
</script>

<style>
html {
  font-family: "Arial", sans-serif;
}


.drag,
.drop {
  box-sizing: border-box;
  display: inline-block;
  border-radius: 10px;
  background: #ccc;
  vertical-align: middle;
  position: relative;
  text-align: center;
  margin:5px;
}

	.drop {
		background: #eee;
		min-height: 72px;
	}
	.drop.over {
		border-color: #aaa;
		background: #ccc;
	}
  .drag {
		color: #fff;
		cursor: move;
		background: #313233;
	}
  .used {
		background: #aaa;
	}
</style>
