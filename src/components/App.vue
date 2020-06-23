<template lang="pug">
  div
    div(v-if="loading" style="min-height:100vh;display:grid;place-items:center;place-content: center;color:#33406f;font-size:x-large")
      svg.tea(width='37' height='48' viewbox='0 0 37 48' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M27.0819 17H3.02508C1.91076 17 1.01376 17.9059 1.0485 19.0197C1.15761 22.5177 1.49703 29.7374 2.5 34C4.07125 40.6778 7.18553 44.8868 8.44856 46.3845C8.79051 46.79 9.29799 47 9.82843 47H20.0218C20.639 47 21.2193 46.7159 21.5659 46.2052C22.6765 44.5687 25.2312 40.4282 27.5 34C28.9757 29.8188 29.084 22.4043 29.0441 18.9156C29.0319 17.8436 28.1539 17 27.0819 17Z' stroke='#33406f' stroke-width='2')
        path(d='M29 23.5C29 23.5 34.5 20.5 35.5 25.4999C36.0986 28.4926 34.2033 31.5383 32 32.8713C29.4555 34.4108 28 34 28 34' stroke='#33406f' stroke-width='2')
        path#teabag(fill='#33406f' fill-rule='evenodd' clip-rule='evenodd' d='M16 25V17H14V25H12C10.3431 25 9 26.3431 9 28V34C9 35.6569 10.3431 37 12 37H18C19.6569 37 21 35.6569 21 34V28C21 26.3431 19.6569 25 18 25H16ZM11 28C11 27.4477 11.4477 27 12 27H18C18.5523 27 19 27.4477 19 28V34C19 34.5523 18.5523 35 18 35H12C11.4477 35 11 34.5523 11 34V28Z')
        path#steamL(d='M17 1C17 1 17 4.5 14 6.5C11 8.5 11 12 11 12' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' stroke='#33406f')
        path#steamR(d='M21 6C21 6 21 8.22727 19 9.5C17 10.7727 17 13 17 13' stroke='#33406f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round')
      
    div(v-if="!loading && !matchup" style="min-height:100vh;display:grid;place-items:center;place-content: center;color:#33406f;font-size:x-large")
      div.fade-in could not load any data, are you logged in?
      svg.tea(width='37' height='48' viewbox='0 0 37 48' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M27.0819 17H3.02508C1.91076 17 1.01376 17.9059 1.0485 19.0197C1.15761 22.5177 1.49703 29.7374 2.5 34C4.07125 40.6778 7.18553 44.8868 8.44856 46.3845C8.79051 46.79 9.29799 47 9.82843 47H20.0218C20.639 47 21.2193 46.7159 21.5659 46.2052C22.6765 44.5687 25.2312 40.4282 27.5 34C28.9757 29.8188 29.084 22.4043 29.0441 18.9156C29.0319 17.8436 28.1539 17 27.0819 17Z' stroke='#33406f' stroke-width='2')
        path(d='M29 23.5C29 23.5 34.5 20.5 35.5 25.4999C36.0986 28.4926 34.2033 31.5383 32 32.8713C29.4555 34.4108 28 34 28 34' stroke='#33406f' stroke-width='2')
        path#teabag(fill='#33406f' fill-rule='evenodd' clip-rule='evenodd' d='M16 25V17H14V25H12C10.3431 25 9 26.3431 9 28V34C9 35.6569 10.3431 37 12 37H18C19.6569 37 21 35.6569 21 34V28C21 26.3431 19.6569 25 18 25H16ZM11 28C11 27.4477 11.4477 27 12 27H18C18.5523 27 19 27.4477 19 28V34C19 34.5523 18.5523 35 18 35H12C11.4477 35 11 34.5523 11 34V28Z')
        path#steamL(d='M17 1C17 1 17 4.5 14 6.5C11 8.5 11 12 11 12' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' stroke='#33406f')
        path#steamR(d='M21 6C21 6 21 8.22727 19 9.5C17 10.7727 17 13 17 13' stroke='#33406f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round')

    div(v-if="matchup")
      .container-fluid
        h3 Clan Draft Result - {{matchup.competition}}, House {{matchup.house}}, Round {{matchup.round}}
        template(v-if="leader")
          p Drag the teams to their corresponding game. Add used powers, inform other Clan leader once the Draft Result is saved.

          button.btn.btn-primary(@click='handleSave()' v-if="!isUnchanged() && !matchup.drafted") save
          button.btn.btn-primary.mx-1(@click='handleConfirm()' v-if="isUnchanged() && !matchup.drafted") confirm


        template(v-if='matchup !== null')
          .row
            // available home teams
            .col-3
              .col-12.text-center
                h2 {{matchup.home.clan.name}}
              drag.drag.col-12(
                v-for='(team,i) of matchup.home.clan.teams' 
                :key='i' :transfer-data='{team:team, side:"home"}' 
                :class='{ used:used(team.team.id)}' 
                :draggable='!used(team.team.id)'  
                @dragstart='handleDragStart'
              )
                team(v-bind:reddit="'test'" v-bind:team='team')
            // Matchups
            .col-6.mx-0.px-0
              .row.col-12.justify-content-center(v-for='(contest,i) of contests' :key='i')
                .col-12.text-center
                  h2 Game {{i+1}}
                .col
                  drop.drop.col-12.px-0(data-home='' :class='{ over:over === -(i+1), planned:used(contest.homeTeam ? contest.homeTeam.team.id :0) }' @dragover='handleDragover("home", -(i+1),...arguments)' @dragleave='over = false' @drop='updateContest({contest, team:arguments[0], home:true});over=false;')
                    .float-left.m-1(style="color:#eeeeee;font-size:1.5rem;")
                      svg.bi.bi-trash(width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" @click="updateContest({contest, team:undefined, home:true})")
                        path(d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z")
                        path(fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z")
                    team(v-bind:reddit="'test'" v-bind:team='contest.homeTeam')
                .col
                  drop.drop.col-12.px-0(data-away='' :class='{ over: over === i+1, planned:used(contest.awayTeam ? contest.awayTeam.team.id :0) }' @dragover='handleDragover("away", i+1,...arguments)' @dragleave='over = false' @drop='updateContest({contest, team:arguments[0], home:false});over=false;')
                    .float-right.m-1(style="color:#eeeeee;font-size:1.5rem;")
                      svg.bi.bi-trash(width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" @click="updateContest({contest, team:undefined, home:false})")
                        path(d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z")
                        path(fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z")
                    team(v-bind:reddit="'test'" v-bind:team='contest.awayTeam')

            // available away teams
            .col-3
              .col-12.text-center
                h2 {{matchup.away.clan.name}}
              drag.drag.col-12(v-for='(team,i) of matchup.away.clan.teams' :key='i' :transfer-data='{team:team,side:"away"}' :class='{ used:used(team.team.id)}')
                team(v-bind:reddit="'test'" v-bind:team='team')
          .row.col-12
            .col-6
              h3 Available Powers
              powers(:powers='matchup.home.clan.powers' :home='true' :use='usePower')
              hr
              h3 Used Powers
              powers(:powers='usedPowers.home' :home='true' :unuse='unusePower')
            .col-6
              .row.col-12
                h3.col-12.text-right Available Powers
              powers(:powers='matchup.away.clan.powers' :home='false' :use='usePower')
              hr
              .row.col-12
                h3.col-12.text-right Used Powers
              powers(:powers='usedPowers.away' :home='false' :unuse='unusePower')
    Toasts(
      :show-progress="false"
      :rtl="false"
      :max-messages="7"
      :time-out="5000" 
      :closeable="true")
</template>

<script>
import { Drag,Drop } from 'vue-drag-drop';
import Team from "./Team.vue";
import Powers from "./Powers.vue";
import { mapActions, mapGetters ,mapState } from 'vuex'

export default {
  components: { Drag, Drop, Powers, Team },
  computed: mapState({
    ...mapGetters('draft',['awayTeam', 'homeTeam', 'used','isUnchanged']),
    ...mapGetters('powers',['powerName']),
    matchup: state => state.draft.matchup,
    contests: state => state.draft.contests,
    usedPowers: state => state.draft.usedPowers,
    leader: state => state.draft.leader,
    loading: state => state.draft.loading
  }),
  data: function () {
    return { 
      over: false
     };
  },  
  methods: {
    ...mapActions('draft', ['confirm','save','unusePower','updateContest','usePower']),
    handleSave: async function(){
      const result = await this.save();
      if(result === true) this.$toast.success("Saved successfully.");
      else this.$toast.error(result);
    },
    handleConfirm: async function(){
      let result = await this.confirm();
      if (result === true) this.$toast.success("Confirmed successfully.");
      else this.$toast.error(result);
    },
    handleDragover: function(side, index, data,event){
      this.over = index;
      if (side !== data.side){
        event.dataTransfer.dropEffect = 'none';
      }
    },
    handleDragStart: function(data,event){
      if (!event.target.classList.contains("drag")){
        event.preventDefault();
      }
    }
  },
  created () {
    const queryString = window.location.search.replace("/clandraft","").split("/");
    if (queryString.length > 0){
        const params = new URL(window.location).searchParams;
        this.$store.dispatch(`draft/getMatchup`,{division: params.get("division"), round: Number(params.get("round")), house: Number(params.get("house"))});
    }
    else this.$store.dispatch('draft/getMatchup');
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
  .planned {
		background: #313233;
	}

  svg.tea #teabag {
    transform-origin: top center;
    transform: rotate(2deg);
    animation: swing 2s infinite;
  }
  svg.tea #steamL {
    stroke-dasharray: 13;
    stroke-dashoffset: 13;
    animation: steamLarge 2s infinite;
  }
  svg.tea #steamR {
    stroke-dasharray: 9;
    stroke-dashoffset: 9;
    animation: steamSmall 2s infinite;
  }
  @-moz-keyframes swing {
    50% {
      transform: rotate(-2deg);
    }
  }
  @-webkit-keyframes swing {
    50% {
      transform: rotate(-2deg);
    }
  }
  @-o-keyframes swing {
    50% {
      transform: rotate(-2deg);
    }
  }
  @keyframes swing {
    50% {
      transform: rotate(-2deg);
    }
  }
  @-moz-keyframes steamLarge {
    0% {
      stroke-dashoffset: 13;
      opacity: 0.6;
    }
    100% {
      stroke-dashoffset: 39;
      opacity: 0;
    }
  }
  @-webkit-keyframes steamLarge {
    0% {
      stroke-dashoffset: 13;
      opacity: 0.6;
    }
    100% {
      stroke-dashoffset: 39;
      opacity: 0;
    }
  }
  @-o-keyframes steamLarge {
    0% {
      stroke-dashoffset: 13;
      opacity: 0.6;
    }
    100% {
      stroke-dashoffset: 39;
      opacity: 0;
    }
  }
  @keyframes steamLarge {
    0% {
      stroke-dashoffset: 13;
      opacity: 0.6;
    }
    100% {
      stroke-dashoffset: 39;
      opacity: 0;
    }
  }
  @-moz-keyframes steamSmall {
    10% {
      stroke-dashoffset: 9;
      opacity: 0.6;
    }
    80% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
    100% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
  }
  @-webkit-keyframes steamSmall {
    10% {
      stroke-dashoffset: 9;
      opacity: 0.6;
    }
    80% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
    100% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
  }
  @-o-keyframes steamSmall {
    10% {
      stroke-dashoffset: 9;
      opacity: 0.6;
    }
    80% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
    100% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
  }
  @keyframes steamSmall {
    10% {
      stroke-dashoffset: 9;
      opacity: 0.6;
    }
    80% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
    100% {
      stroke-dashoffset: 27;
      opacity: 0;
    }
  }

  .fade-in {
    animation: fadeIn ease 5s;
  }
  @keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
   }
  }
  
</style>