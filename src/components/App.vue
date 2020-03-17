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
            <powers :powers="matchup.home.clan.powers" :home="true" :cb="usePower">
            </powers>  
            <hr>
            <powers :powers="usedPowers.home" :home="true" :cb="unusePower">
            </powers>  
            <button class="btn btn-primary" @click="save">save</button>
          </div>
          <div class="col-6">
            <powers :powers="matchup.away.clan.powers" :home="false" :cb="usePower">
            </powers>  
            <hr>
            <powers :powers="usedPowers.away" :home="false" :cb="unusePower">
            </powers>  
          </div>
        </div>
      </template>

      <template v-if="showAssassination">
        <div class="modal fade" tabindex="-1" role="dialog" id="assassination">
            <div class="modal-dialog modal-dialog-centered" role="document"><template v-if="selectedSide !== null &amp;&amp; oppositeSide !== null">
                    <div class="modal-content">
                        <div class="modal-header">
                            <slot name="header">
                                <h5 class="modal-title">Apply Assassination for {{`[${selectedSide.clan.name}]`}}</h5><button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <div class="input-group-prepend"><span class="input-group-text" id="home">Assassinate</span><select class="form-control" v-model="selectedTeam" @change="loadPlayersForAssassination()">
                                    <option v-for="team in oppositeSide.clan.teams" v-bind:value="team.team.id" v-bind:key="team.team.id">{{ team.team.name }}</option>
                                </select></div><template v-if="selectedTeam">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend"><span class="input-group-text" id="home">player</span><select class="form-control" v-model="selectedPlayer">
                                            <option v-for="player in assPlayers" v-bind:value="player.id" v-bind:key="player.id">{{ player.name }} </option>
                                        </select></div>
                                </div>
                            </template>
                        </div>
                        <div class="modal-footer">
                            <slot name="footer"><button class="btn btn-secondary" type="button" data-dismiss="modal" @click="reset">Cancel &amp; Close</button><button class="btn btn-primary" type="button" @click="saveAssassination">Use </button></slot>
                        </div>
                    </div>
                </template></div>
        </div>        
      </template>

    </div>
  </div>
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
