<template>
  <div>
    <div class="container-fluid">
      <h3>Nested drag elements</h3>
      <p>You have to stopPropagation on the child's dragstart event, otherwise the parent's transfer data takes precedence.</p>
      <template v-if="matchup !== null">
        <div class="row">
          <!-- available home teams -->
          <div class="col-3">
            <drag class="drag col-12" v-for="(team,i) of matchup.home.clan.teams"
              :key="i"
              :transfer-data="{team:team}" 
              :class="{ used:used(team.team.id)}"
            >
              <team 
                v-bind:reddit="'test'"
                v-bind:team="team"
              ></team>
            </drag>
          </div>
          <!-- Matchups -->
          <div class="col-6 mx-0 px-0">
            <div class="row col-12 justify-content-center" v-for="(contest,i) of contests" :key="i">
              <div class="col-12 text-center">
                <h2>Matchup </h2>
              </div>

              <div class="col">
                <drop class="drop col-12 px-0" data-home 
                  :class="{ over }"
                  @dragover="over = true"
                  @dragleave="over = false"
                  @drop="updateContest({contest, team:arguments[0], home:true})">
                  <team 
                    v-bind:reddit="'test'"
                    v-bind:team="contest.homeTeam"
                  ></team>
                </drop>
              </div>
              <div class="col">
                <drop class="drop col-12 px-0" data-away
                  :class="{ over }"
                  @dragover="over = true"
                  @dragleave="over = false"
                  @drop="updateContest({contest, team:arguments[0], home:false})">
                  <team 
                    v-bind:reddit="'test'"
                    v-bind:team="contest.awayTeam"
                  ></team>
                </drop>
              </div>
            </div>
          </div>
          <!-- available away teams -->
          <div class="col-3">
            <drag class="drag col-12" v-for="(team,i) of matchup.away.clan.teams"
              :key="i"
              :transfer-data="{team:team}" 
              :class="{ used:used(team.team.id)}"
            >
              <team 
                v-bind:reddit="'test'"
                v-bind:team="team"
              ></team>
            </drag>
          </div>
        </div>

        <div class="row col-12">
          <div class="col-6">
            <powers v-bind:powers="matchup.home.clan.powers" v-bind:descriptions="powers">
            </powers>
            <button class="btn btn-primary" @click="save">save</button>
          </div>
          <div class="col-6">
            <powers v-bind:powers="matchup.home.clan.powers" v-bind:descriptions="powers">
            </powers>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Drag,Drop } from 'vue-drag-drop';
import Team from "./Team.vue";
import { mapActions, mapGetters ,mapState } from 'vuex'
import Powers from "./Powers.vue";

export default {
  components: { Drag, Drop, Powers, Team },
  computed: mapState({
    ...mapGetters('draft',['awayTeam', 'homeTeam', 'used']),
    matchup: state => state.draft.matchup,
    contests: state => state.draft.contests,
    powers: state => state.powers.powers
  }),
  data: function () {
    return { over: false };
  },  
  methods: {
    ...mapActions('draft', ['updateContest','save']) 
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
