<template lang="pug">
  div
    template(v-for="power in Object.keys(powers)")
      template(v-for="i in powers[power]")
        template(v-if="['assassination','inspiration','bloodSacrifice','stuntyAssassination','stuntyInspiration'].includes(power)")
          template(v-if="use")
            button.btn.btn-outline-info.btn-sm.m-1(type="button" @click="currentPower=power;" data-toggle="modal" v-bind:data-target="`#player-${id}`") {{powerName(power)}} 
          template(v-else-if="unuse")
            .border.border-info.text-info.m-1.d-inline-block.align-top(style="width: max-content;border-radius: .2rem;padding: .25rem .5rem" @click="unuse({power,home})")
              h5 {{powerName(power)}} 
              h6 {{i.team.name}}
              span.badge.badge-info.mx-1 {{i.player.name}}
              template(v-if="i.player2")
                span.badge.badge-info.mx-1 {{i.player2.name}}

        template(v-else-if="['emergencyRnR'].includes(power)")
          template(v-if="use")
            button.btn.btn-outline-info.btn-sm.m-1(type="button" @click="currentPower=power;" data-toggle="modal" v-bind:data-target="`#team-${id}`") {{powerName(power)}} 
          template(v-else-if="unuse")
            .border.border-info.text-info.m-1.d-inline-block.align-top(style="width: max-content;border-radius: .2rem;padding: .25rem .5rem" @click="unuse({power,home})")
              h5 {{powerName(power)}} 
              h6 {{i.team.name}}
        template(v-else-if="['badInducementDeal','lastMinuteSwitch','miscommunication','stuntyBadInducementDeal','stuntyLastMinuteSwitch','stuntyMiscommunication','confusion','stuntyConfusion','hatredOfPublicTransport','stuntyHatredOfPublicTransport','financialFairPlay'].includes(power)")
          button.btn.btn-outline-info.btn-sm.m-1(type="button" v-bind:key="power+i" @click="use ? use({power,home}) : unuse({power,home})") {{powerName(power)}} 

    .modal.fade(tabindex='-1' role='dialog' v-bind:id="`player-${id}`")
      .modal-dialog.modal-dialog-centered(role='document')
        .modal-content
          .modal-header
            slot(name='header')
              template(v-if="currentPower != ''")
                h5.modal-title Apply {{powerName(currentPower)}}  
              button.close(type='button' data-dismiss='modal' aria-label='Close')
                span(aria-hidden='true') &times;
          .modal-body
            .input-group.mb-3
              .input-group-prepend
                span#home.input-group-text Select team
              select.form-control(v-model='selectedTeam' @change='loadPlayers()')
                template(v-if='["assassination","stuntyAssassination"].indexOf(currentPower) > -1')
                  option(v-for='team in (home ? awayTeams() : homeTeams())' v-bind:value='{id: team.team.id, name: team.team.name, coachId: team.team.idcoach}' v-bind:key='team.team.id') {{ team.team.name }}
                template(v-else)
                  option(v-for='team in (home ? homeTeams() : awayTeams())' v-bind:value='{id: team.team.id, name: team.team.name, coachId: team.team.idcoach}' v-bind:key='team.team.id') {{ team.team.name }}
            template(v-if='selectedTeam')
              .input-group.mb-3
                .input-group-prepend
                  span#home.input-group-text Select player
                select.form-control(v-model='selectedPlayer')
                  option(v-for='player in players' v-bind:value='{id: player.id, name:player.name}' v-bind:key='player.id') {{ player.name }} 
              template(v-if='currentPower === "bloodSacrifice"')
                .input-group.mb-3
                  .input-group-prepend
                    span#home.input-group-text Optional 2nd player 
                  select.form-control(v-model='selectedPlayer2')
                    option(v-for='player in players' v-bind:value='{id: player.id, name:player.name}' v-bind:key='player.id') {{ player.name }} 
          .modal-footer
            slot(name='footer')
              button.btn.btn-secondary(type='button' data-dismiss='modal' ) Cancel &amp; Close
              button.btn.btn-primary(type='button' @click="use({power:currentPower,home,team:selectedTeam,player:selectedPlayer,player2:selectedPlayer2});close('player')") Use 

    .modal.fade(tabindex='-1' role='dialog' v-bind:id="`team-${id}`")
      .modal-dialog.modal-dialog-centered(role='document')
        .modal-content
          .modal-header
            slot(name='header')
              template(v-if="currentPower != ''")
                h5.modal-title Apply {{powerName(currentPower)}}  
              button.close(type='button' data-dismiss='modal' aria-label='Close')
                span(aria-hidden='true') &times;
          .modal-body
            .input-group
              .input-group-prepend
                span#home.input-group-text Select team
              select.form-control(v-model='selectedTeam')
                option(v-for='team in (home ? homeTeams() : awayTeams())' v-bind:value='{id: team.team.id, name: team.team.name, coachId: team.team.idcoach}' v-bind:key='team.team.id') {{ team.team.name }}
          .modal-footer
            slot(name='footer')
              button.btn.btn-secondary(type='button' data-dismiss='modal' ) Cancel &amp; Close
              button.btn.btn-primary(type='button' @click="use({power:currentPower,home,team:selectedTeam});close('team')") Use 

</template>

<script>
import { mapGetters ,mapState } from 'vuex'

const uuidv4 = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );

export default {
  data: function(){
    return{
      id: uuidv4(),
      currentPower:"",
      selectedTeam:0,
      selectedPlayer:"",
      selectedPlayer2:"",
      players:[]
    };
  },
  props:["powers","home", "use", "unuse"],
  computed: mapState({
    ...mapGetters('powers',['powerName']),
    ...mapGetters('draft',['awayTeams','homeTeams','getPlayers'])
  }),  
  methods: {
    loadPlayers:async function(){
      this.players = await this.getPlayers(this.selectedTeam.id);
      this.selectedPlayer = "";
      this.selectedPlayer2 = "";
    },
    close: function(id){
      const em = document.getElementById(`${id}-${this.id}`);
      em.classList.toggle("show");
      em.style.display = "none";
      const backdrop = document.getElementsByClassName("modal-backdrop")[0];
      backdrop.classList.toggle("show");
      backdrop.parentNode.removeChild(backdrop);
      const body = document.getElementsByClassName("modal-open")[0];
      body.classList.toggle("modal-open");
    }
  }
};
</script>

<style>

</style>
